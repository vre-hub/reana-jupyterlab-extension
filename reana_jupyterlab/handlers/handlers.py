from jupyter_server.utils import url_path_join
from jupyter_server.serverapp import ServerApp
from .connection import EnvVariablesHandler
from .files import FileBrowserHandler
from .workflows import (
    WorkflowsHandler,
    WorkflowLogsHandler, 
    WorkflowWorkspaceHandler, 
    WorkflowSpecificationHandler,
    WorkspaceFilesHandler,
    WorkflowCreateHandler,
    WorkflowValidateHandler,
)

def setup_handlers(server_app: ServerApp) -> None:
    web_app = server_app.web_app
    host_pattern = ".*$"
    base_url = url_path_join(web_app.settings["base_url"], "reana_jupyterlab")
    handlers = [
        (url_path_join(base_url, "env"), EnvVariablesHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "workspace", "([^/]+)"), WorkspaceFilesHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "workspace"), WorkflowWorkspaceHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "logs"), WorkflowLogsHandler),
        (url_path_join(base_url, "workflows", "([^/]+)", "specification"), WorkflowSpecificationHandler),
        (url_path_join(base_url, "workflows"), WorkflowsHandler),
        (url_path_join(base_url, "run"), WorkflowCreateHandler),
        (url_path_join(base_url, "validate"), WorkflowValidateHandler),
        (url_path_join(base_url, "files"), FileBrowserHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)