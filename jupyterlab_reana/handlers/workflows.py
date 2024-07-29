from jupyter_server.base.handlers import APIHandler
import os
import json
import requests
from urllib.parse import quote_plus, urlencode

endpoint = 'workflows'

class WorkflowsHandler(APIHandler):
    def _parse_workflow(self, workflow):
        parsed_workflow = {}

        parsed_workflow['id'] = workflow.get('id', '')
        info = workflow.get('name', '').rsplit('.', 1)
        parsed_workflow['name'], parsed_workflow['run'] = info
        parsed_workflow['status'] = workflow.get('status')

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
        params['type'] = 'batch'
        params['size'] = 5

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
        logs = wf.get('logs', '')
        return json.dumps({'engineLogs': logs})
    
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

        
class WorkflowStatusHandler(APIHandler):
    def _parse_workflow(self, workflow):
        parsed_workflow = {}

        parsed_workflow['id'] = workflow.get('id', '')
        info = workflow.get('name', '').rsplit('.', 1)
        parsed_workflow['name'], parsed_workflow['run'] = info
        parsed_workflow['status'] = workflow.get('status')
        parsed_workflow['createdAt'] = workflow.get('created')
        parsed_workflow['startedAt'] = workflow.get('progress').get('run_started_at')
        parsed_workflow['finishedAt'] = workflow.get('progress').get('run_finished_at')
        parsed_workflow['stoppedAt'] = workflow.get('progress').get('run_stopped_at')
        parsed_workflow['status'] = workflow.get('status')

        return parsed_workflow

    def get(self, workflow_id):
        server_url = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_id}/status?access_token={access_token}")
            print(response.json())
            workflow = self._parse_workflow(response.json())
            self.finish(workflow)

        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

class WorkflowWorkspaceHandler(APIHandler):
    def get(self, workflow_id):
        server_url = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            response = requests.get(f"{server_url}/api/{endpoint}/{workflow_id}/workspace?access_token={access_token}")
            self.finish(response.json())
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