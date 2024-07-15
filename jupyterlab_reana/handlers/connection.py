from jupyter_server.base.handlers import APIHandler
import os
import json
import configparser

class EnvVariablesHandler(APIHandler):
    tmp_file_path = '/tmp/jl_reana_config.vars'

    def get(self):
        if os.path.exists(self.tmp_file_path):
            config = configparser.ConfigParser()
            config.read(self.tmp_file_path)
            server = config['REANA']['REANA_SERVER_URL']
            access_token = config['REANA']['REANA_ACCESS_TOKEN']
            os.environ['REANA_SERVER_URL'] = server
            os.environ['REANA_ACCESS_TOKEN'] = access_token
        else:
            server = ''
            access_token = ''

        self.finish(json.dumps({
            'server': server,
            'accessToken': access_token
        }))
        
    def post(self):
        data = self.get_json_body()

        # Save the data (TODO [REANA-CLIENT]: Only if ping is successful, otherwise show error message)
        server = data['server']
        access_token = data['accessToken']
        os.environ['REANA_SERVER_URL'] = server
        os.environ['REANA_ACCESS_TOKEN'] = access_token

        with open(self.tmp_file_path, 'w') as f:
            f.write(f'[REANA]\nREANA_SERVER_URL={server}\nREANA_ACCESS_TOKEN={access_token}\n')

        print(f'file path: {f.name}')

        self.finish(json.dumps({
            'status': 'success',
            'message': 'Credentials saved successfully. Please refresh any running terminals.'
        }))
