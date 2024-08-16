import pytest
from reana_jupyterlab.handlers.connection import EnvVariablesHandler

pytest_plugins = ["pytest_jupyter.jupyter_server"]

@pytest.fixture
def jp_server_config():
    return {
        "ServerApp": {
            "jpserver_extensions": {"reana_jupyterlab": True},
        }
    }
