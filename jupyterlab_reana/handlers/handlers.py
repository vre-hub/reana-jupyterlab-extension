from jupyter_server.utils import url_path_join
from jupyter_server.serverapp import ServerApp
from .connection import EnvVariablesHandler

def setup_handlers(server_app: ServerApp) -> None:
    web_app = server_app.web_app
    host_pattern = ".*$"
    base_url = url_path_join(web_app.settings["base_url"], "jupyterlab_reana")
    route_pattern = url_path_join(base_url, "env_variables")
    handlers = [(route_pattern, EnvVariablesHandler)]
    web_app.add_handlers(host_pattern, handlers)