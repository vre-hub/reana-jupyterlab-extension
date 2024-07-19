from jupyter_server.utils import url_path_join
from jupyter_server.serverapp import ServerApp
from .connection import EnvVariablesHandler
from .workflows import WorkflowsHandler

def setup_handlers(server_app: ServerApp) -> None:
    web_app = server_app.web_app
    host_pattern = ".*$"
    base_url = url_path_join(web_app.settings["base_url"], "jupyterlab_reana")
    handlers = [
        (url_path_join(base_url, "env"), EnvVariablesHandler),
        (url_path_join(base_url, "workflows"), WorkflowsHandler),
    ]
    web_app.add_handlers(host_pattern, handlers)