import os
import requests

class ReanaAPIClient:
    def __init__(self):
        self.server_url = os.getenv('REANA_SERVER_URL', '')
        self.access_token = os.getenv('REANA_ACCESS_TOKEN', '')

    def _get_headers(self):
        return {
            'Authorization': f'Bearer {self.access_token}'
        }

    def get(self, endpoint, params=None):
        if params is None:
            params = {}

        headers = self._get_headers()
        response = requests.get(
            f"{self.server_url}/api/{endpoint}",
            headers=headers,
            params=params
        )
        return response

    def post(self, endpoint, json=None, params=None):
        if params is None:
            params = {}

        headers = self._get_headers()
        response = requests.post(
            f"{self.server_url}/api/{endpoint}",
            headers=headers,
            json=json,
            params=params
        )
        return response
