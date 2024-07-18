from jupyter_server.base.handlers import APIHandler
import os
import json
from reana_client.api.client import ping
from reana_commons.api_client import BaseAPIClient

class EnvVariablesHandler(APIHandler):
    def get(self):
        server = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        self.finish(json.dumps({
            'server': server,
            'accessToken': access_token
        }))
        
    def post(self):
        data = self.get_json_body()

        try:
            server = data['server']
            access_token = data['accessToken']

            os.environ['REANA_SERVER_URL'] = server
            os.environ['REANA_ACCESS_TOKEN'] = access_token
            BaseAPIClient("reana-server")

            response = ping(access_token)

            if response.get('error', True):
                self.finish(json.dumps({
                    'status': 'error',
                    'message': f'Could not connect to the REANA server. {response.get("status", "").capitalize()}'
                }))
            else:
                self.finish(json.dumps({
                    'status': 'success',
                    'message': 'Credentials saved successfully. Please close any running terminals to apply the changes.'
                }))
                

        except Exception as e:
            print(e)
            self.finish(json.dumps({
                'status': 'error',
                'message': 'Something went wrong. Please try again.'
            }))