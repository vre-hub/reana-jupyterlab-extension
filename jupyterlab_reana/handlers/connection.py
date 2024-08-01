from jupyter_server.base.handlers import APIHandler
import os
import json
import requests

endpoint = 'ping'
class EnvVariablesHandler(APIHandler):
    def _update_env(self, access_token='', server=''):
        os.environ['REANA_SERVER_URL'] = server
        os.environ['REANA_ACCESS_TOKEN'] = access_token  
    
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
            server = data.get('server', '')
            access_token = data.get('accessToken', '')

            self._update_env(access_token, server)

            response = requests.get(f"{server}/api/{endpoint}?access_token={access_token}")

            data = response.json()

            if data.get('status', '500') != '200':
                self._update_env()
                self.finish(json.dumps({
                    'status': 'error',
                    'message': f'Could not connect to the REANA server. {data.get("message", "").capitalize()}'
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