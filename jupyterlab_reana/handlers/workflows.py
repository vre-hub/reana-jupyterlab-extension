from jupyter_server.base.handlers import APIHandler
import os
import json
import re
import requests
import subprocess
from urllib.parse import quote_plus, urlencode

# import ../const.py file
from ..const import (
    WORKFLOWS_PAGE_SIZE,
    WORKFLOWS_TYPE,
    WORKSPACE_PAGE_SIZE
)

endpoint = 'workflows'

class WorkflowsHandler(APIHandler):
    def _parse_workflow(self, workflow):
        parsed_workflow = {}

        parsed_workflow['id'] = workflow.get('id', '')
        info = workflow.get('name', '').rsplit('.', 1)
        parsed_workflow['name'], parsed_workflow['run'] = info
        parsed_workflow['status'] = workflow.get('status')
        parsed_workflow['createdAt'] = workflow.get('created')
        parsed_workflow['startedAt'] = workflow.get('progress').get('run_started_at', '')
        parsed_workflow['finishedAt'] = workflow.get('progress').get('run_finished_at', '')
        parsed_workflow['stoppedAt'] = workflow.get('progress').get('run_stopped_at', '')
        parsed_workflow['finishedJobs'] = workflow.get('progress').get('finished', {}).get('total', 0)
        parsed_workflow['totalJobs'] = workflow.get('progress').get('total', {}).get('total', 0)

        return parsed_workflow
    
    def _parse_workflows(self, workflows):
        parsed_workflows = []

        data = workflows.json()

        for workflow in data['items']:
            parsed_workflows.append(self._parse_workflow(workflow))

        data['items'] = parsed_workflows

        return data

    def _parse_params(self, params):
        params = {key: params[key][0].decode('utf-8') for key in params if not key.isdigit()}

        if 'status' in params and params['status'] == 'all':
            del params['status']

        if 'search' in params:
            params['search'] = json.dumps({'name': [params['search']]})

        params['access_token'] = os.getenv('REANA_ACCESS_TOKEN', '')
        params['type'] = WORKFLOWS_TYPE
        params['size'] = WORKFLOWS_PAGE_SIZE
        params['include_progress'] = True

        string_params = urlencode(params, quote_via=quote_plus)

        return string_params

    def get(self):
        params = self.request.query_arguments
        string_params = self._parse_params(params)
        server_url = os.getenv('REANA_SERVER_URL', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}?{string_params}")
            workflows = self._parse_workflows(response)
            self.finish(json.dumps(workflows))
        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkflowLogsHandler(APIHandler):
    def _parse_logs(self, workflow):
        wf = workflow.json()
        logs = json.loads(wf.get('logs', ''))
        return json.dumps(
            {
                'engineLogs': logs['workflow_logs'],
                'jobLogs': logs['job_logs']
            }
        )
    
    def get(self, workflow_id):
        server_url = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_id}/logs?access_token={access_token}")
            logs = self._parse_logs(response)
            self.finish(logs)

        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkflowWorkspaceHandler(APIHandler):
    def _parse_files(self, files):
        parsed_files = []

        for file in files:
            parsed_files.append(
                {
                    'name': file.get('name'),
                    'lastModified': file.get('last-modified'),
                    'size': file.get('size').get('human_readable'),
                }
            )

        return parsed_files
    
    def _parse_params(self, params):
        params = {key: params[key][0].decode('utf-8') for key in params if not key.isdigit()}

        if 'search' in params:
            params['search'] = json.dumps({'name': [params['search']]})

        params['access_token'] = os.getenv('REANA_ACCESS_TOKEN', '')
        params['size'] = WORKSPACE_PAGE_SIZE

        string_params = urlencode(params, quote_via=quote_plus)

        return string_params
    
    def get(self, workflow_id):
        params = self.request.query_arguments
        string_params = self._parse_params(params)
        server_url = os.getenv('REANA_SERVER_URL', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_id}/workspace?{string_params}")
            data = response.json()
            data['files'] = self._parse_files(data.pop('items'))
            self.finish(data)
        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkflowSpecificationHandler(APIHandler):
    def get(self, workflow_id):
        server_url = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_id}/specification?access_token={access_token}")
            self.finish(response.json())
        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkspaceFilesHandler(APIHandler):
    def get(self, workflow_name, file_name):
        server_url = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            file = quote_plus(file_name)
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_name}/workspace/{file}?access_token={access_token}")

            path = file_name.rsplit('/', 1)
            path = path[0] if len(path) > 1 else ''
            
            os.makedirs(workflow_name + '/' + path, exist_ok=True)

            with open(workflow_name + '/' + file_name, 'wb') as f:
                f.write(response.content)
            self.finish(json.dumps({
                'status': 'success',
                'message': f'{file_name} downloaded'
            }))
        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))


class WorkflowCreateHandler(APIHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)

            wf_name = body.get('name')

            path = os.path.join(os.getcwd(), body.get('path'))
            path_split = path.rsplit('/', 1)
            workspace, yaml_file = path_split

            if '..' in path or not os.path.isdir(workspace) or not yaml_file.endswith('.yaml'):
                raise Exception('Invalid path')
            
            # Check that the workflow name does not have characters that may cause issues
            if re.fullmatch(r'\w+', wf_name) is None:
                raise Exception('Invalid workflow name')
            
            result = subprocess.run(['reana-client', 'run', '-w', wf_name, '-f', yaml_file], cwd=workspace, capture_output=True)

            if result.returncode != 0:
                raise Exception(result.stderr.decode('utf-8'))
            
            self.finish(json.dumps({
                'status': 'success',
                'message': 'Workflow created'
            }))

        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkflowValidateHandler(APIHandler):
    def post(self):
        try:
            body = json.loads(self.request.body)
            path = os.path.join(os.getcwd(), body.get('path'))

            path_split = path.rsplit('/', 1)
            workspace, yaml_file = path_split

            if '..' in path or not os.path.isdir(workspace) or not yaml_file.endswith('.yaml'):
                raise Exception('Invalid path')
            
            result = subprocess.run(['reana-client', 'validate', '-f', yaml_file], cwd=workspace, capture_output=True)

            if result.returncode != 0:
                raise Exception(result.stderr.decode('utf-8'))
            
            self.finish(json.dumps({
                'status': 'success',
                'message': result.stdout.decode('utf-8')
            }))

        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))