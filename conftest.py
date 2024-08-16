import pytest
from reana_jupyterlab.handlers.connection import EnvVariablesHandler

pytest_plugins = ["pytest_jupyter.jupyter_server"]

MOCK_SERVER = "https://mock-reana/"
MOCK_TOKEN = 'mock_token'

MOCK_WF1 = {
    "id": "mock_wf_id_1",
    "name": "mock_wf_name.1",
    "status": "running",
    "created": "2020-10-10T10:10:10",
    "progress": {},
}

MOCK_WF2 = {
    "id": "mock_wf_id_2",
    "name": "mock_wf_name.2",
    "status": "finished",
    "created": "2020-10-10T10:10:10",
    "progress": {},
}

MOCK_WORKFLOWS = {
    "items": [MOCK_WF1, MOCK_WF2],
    "total": 2,
    "hasNext": False,
    "hasPrev": False,
}

WF1_LOGS = {
    "logs": '{"workflow_logs":"engine_logs","job_logs":[{"step_1_id":{},"step_2_id":{}}]}'    
}

WF1_LOGS_RESPONSE = {
    "engineLogs": "engine_logs",
    "jobLogs": [{"step_1_id": {}, "step_2_id": {}}]
}


@pytest.fixture
def jp_server_config():
    return {
        "ServerApp": {
            "jpserver_extensions": {"reana_jupyterlab": True},
        }
    }
