from jupyter_server.base.handlers import APIHandler
import os
import json
from reana_client.api.client import get_workflows

class WorkflowsHandler(APIHandler):
    def _parse_workflows(self, workflows):
        parsed_workflows = []

        for workflow in workflows:
            wf = {}
            wf['id'] = workflow.get('id', '')
            info = workflow.get('name', '').rsplit('.', 1)
            wf['name'] = info[0]
            wf['run'] = info[1]
            wf['createdAt'] = workflow.get('created')
            wf['startedAt'] = workflow.get('progress').get('run_started_at')
            wf['finishedAt'] = workflow.get('progress').get('run_finished_at')
            wf['stoppedAt'] = workflow.get('progress').get('run_stopped_at')
            wf['status'] = workflow.get('status')

            parsed_workflows.append(wf)

        return parsed_workflows


    def get(self):
        params = self.request.query_arguments
        params = {key: params[key][0].decode('utf-8') for key in params if not key.isdigit()}

        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        try:
            response = get_workflows(access_token, **params)
            workflows = self._parse_workflows(response)
            self.finish(json.dumps(workflows))
        except Exception as e:
            self.finish(json.dumps({
                'status': 'error',
                'message': str(e)
            }))

