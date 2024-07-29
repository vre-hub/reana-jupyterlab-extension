from jupyter_server.utils import url_path_join
from jupyter_server.serverapp import ServerApp
from .connection import EnvVariablesHandler
from .workflows import (
    WorkflowsHandler, 
    WorkflowStatusHandler, 
    WorkflowLogsHandler, 
    WorkflowWorkspaceHandler, 
    WorkflowSpecificationHandler
)

def setup_handlers(server_app: ServerApp) -> None:
    web_app = server_app.web_app
    host_pattern = ".*$"
    base_url = url_path_join(web_app.settings["base_url"], "jupyterlab_reana")
    handlers = [
        (url_path_join(base_url, "env"), EnvVariablesHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "logs"), WorkflowLogsHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "status"), WorkflowStatusHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "workspace"), WorkflowWorkspaceHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "specification"), WorkflowSpecificationHandler),
        (url_path_join(base_url, "workflows"), WorkflowsHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)