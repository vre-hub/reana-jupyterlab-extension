import pytest
from jupyter_server.utils import url_path_join
from tornado.httpclient import HTTPClientError

# http_server_client sends no auth header (jp_fetch always adds one); every
# endpoint should 403 without it.
ENDPOINTS = [
    ('GET', ['reana_jupyterlab', 'env']),
    ('POST', ['reana_jupyterlab', 'env']),
    ('GET', ['reana_jupyterlab', 'files']),
    ('GET', ['reana_jupyterlab', 'workflows']),
    ('GET', ['reana_jupyterlab', 'workflows', 'wf.1', 'logs']),
    ('GET', ['reana_jupyterlab', 'workflows', 'wf.1', 'workspace']),
    ('GET', ['reana_jupyterlab', 'workflows', 'wf.1', 'specification']),
    ('GET', ['reana_jupyterlab', 'workflows', 'wf', 'workspace', 'file.txt']),
    ('POST', ['reana_jupyterlab', 'run']),
    ('POST', ['reana_jupyterlab', 'validate']),
]


@pytest.mark.parametrize('method, parts', ENDPOINTS)
async def test_endpoint_requires_authentication(
    method, parts, http_server_client, jp_base_url
):
    url = url_path_join(jp_base_url, *parts)
    body = b'{}' if method == 'POST' else None

    with pytest.raises(HTTPClientError) as exc:
        await http_server_client.fetch(
            url, method=method, body=body, allow_nonstandard_methods=True
        )

    assert exc.value.code == 403
