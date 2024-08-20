import json
import pytest

from reana_jupyterlab.tests.mocks.connection import *


@pytest.fixture
def mock_get_env_vars(mocker):
    mocker.patch('os.environ.get', return_value='mock_value')

@pytest.fixture
def mock_post_env_vars_success(mocker):
    response = mocker.Mock()
    response.json.return_value = {
        "reana_server_version": "0.7.0"
    }

    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_post_env_vars_failure(mocker):
    response = mocker.Mock()
    response.status_code = 400

    mocker.patch('requests.get', return_value=response)

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/env'])
async def test_get_env_vars(jp_fetch, endpoint, mock_get_env_vars):
    response = await jp_fetch(endpoint)
    assert response.code == 200
    assert response.headers['Content-Type'] == 'application/json'

    data = json.loads(response.body)

    assert data['server'] == 'mock_value'
    assert data['accessToken'] == 'mock_value'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/env'])
async def test_post_env_vars_success(jp_fetch, endpoint, mock_post_env_vars_success):
    data = {
        'server': MOCK_SERVER,
        'accessToken': MOCK_TOKEN
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)

    assert data.get('status', '') == 'success'
    assert data.get('message', '').startswith('Credentials saved successfully')


@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/env'])
async def test_post_env_vars_failure(jp_fetch, endpoint, mock_post_env_vars_failure):
    data = {
        'server': MOCK_SERVER,
        'accessToken': 'not_a_valid_token'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '').startswith('Could not connect to the REANA server')