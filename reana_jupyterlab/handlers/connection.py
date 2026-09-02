from jupyter_server.base.handlers import APIHandler
import os
import json
import requests
import tornado.web

from .utils import is_allowed_reana_server

endpoint = 'you'

_CONNECT_ERROR = 'Could not connect to the REANA server. Please check the server URL and access token.'


class EnvVariablesHandler(APIHandler):
    def _update_env(self, access_token='', server=''):
        os.environ['REANA_SERVER_URL'] = server
        os.environ['REANA_ACCESS_TOKEN'] = access_token

    @tornado.web.authenticated
    def get(self):
        server = os.getenv('REANA_SERVER_URL', '')
        access_token = os.getenv('REANA_ACCESS_TOKEN', '')

        self.finish(json.dumps({
            'server': server,
            'accessToken': access_token
        }))

    @tornado.web.authenticated
    def post(self):
        data = self.get_json_body() or {}
        server = data.get('server', '')
        access_token = data.get('accessToken', '')

        # the server is fetched from inside the pod, so block internal targets
        if not is_allowed_reana_server(server):
            self.finish(json.dumps({
                'status': 'error',
                'message': 'Could not connect to the REANA server. The server URL is not allowed.'
            }))
            return

        try:
            response = requests.get(
                f"{server}/api/{endpoint}",
                params={'access_token': access_token},
                timeout=10,
            )
            body = response.json()
        except Exception:
            self.finish(json.dumps({'status': 'error', 'message': _CONNECT_ERROR}))
            return

        if response.status_code != 200 or not isinstance(body, dict) or 'reana_server_version' not in body:
            self.finish(json.dumps({'status': 'error', 'message': _CONNECT_ERROR}))
            return

        # only save once it actually worked -- don't clobber a working session
        self._update_env(access_token, server)
        self.finish(json.dumps({
            'status': 'success',
            'message': 'Credentials saved successfully. Please close any running terminals to apply the changes.'
        }))
