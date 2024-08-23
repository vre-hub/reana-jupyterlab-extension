import json
import pytest
import os

from reana_jupyterlab.tests.mocks.workflows import *

@pytest.fixture
def mock_get_workflows(mocker):
    response = mocker.Mock()
    response.json.return_value = MOCK_WORKFLOWS.copy()
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_get_workflow(mocker):
    response = mocker.Mock()

    workflow = MOCK_WORKFLOWS.copy()
    workflow['items'] = [MOCK_WORKFLOWS['items'][0]]
    workflow['total'] = 1

    response.json.return_value = workflow
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_get_workflow_logs(mocker):
    response = mocker.Mock()
    response.json.return_value = WF1_LOGS.copy()
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_get_workspace(mocker):
    response = mocker.Mock()
    response.json.return_value = WF1_FILES.copy()
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_get_workspace_deleted(mocker):
    response = mocker.Mock()
    response.json.return_value = DELETED_WF_FILES.copy()
    response.status_code = 400

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_get_specification(mocker):
    response = mocker.Mock()
    response.json.return_value = WF1_SPECIFICATION.copy()
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)

@pytest.fixture
def mock_download_files(mocker):
    response = mocker.Mock()
    response.content = FILE_CONTENT
    response.status_code = 200

    mocker.patch('requests.get', return_value=response)
    mocker.patch('os.makedirs')
    mocker.patch('builtins.open', mocker.mock_open())

@pytest.fixture
def mock_post_validate_success(mocker):
    response = MOCK_VALIDATE_SUCCESS

    mocker.patch('subprocess.run', return_value=response)
    mocker.patch('os.path.isdir', return_value=True)

@pytest.fixture
def mock_post_validate_error(mocker):
    response = MOCK_VALIDATE_ERROR

    mocker.patch('subprocess.run', return_value=response)
    mocker.patch('os.path.isdir', return_value=True)

@pytest.fixture
def mock_post_validate_invalid_path(mocker):
    mocker.patch('os.path.isdir', return_value=False)

@pytest.fixture
def mock_post_validate_not_yaml_file(mocker):
    mocker.patch('os.path.isdir', return_value=True)

@pytest.fixture
def mock_post_create_success(mocker):
    response = MOCK_RUN_SUCCESS

    mocker.patch('subprocess.run', return_value=response)
    mocker.patch('os.path.isdir', return_value=True)

@pytest.fixture
def mock_post_create_error(mocker):
    response = MOCK_RUN_ERROR

    mocker.patch('subprocess.run', return_value=response)
    mocker.patch('os.path.isdir', return_value=True)

@pytest.fixture
def mock_post_create_invalid_path(mocker):
    mocker.patch('os.path.isdir', return_value=False)


@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows'])
async def test_get_workflows(jp_fetch, endpoint, mock_get_workflows):
    params = {
        'status': 'all',
        'search': '',
        'sort': 'asc',
        'page': 1,
    }

    response = await jp_fetch(endpoint, params=params)
    data = json.loads(response.body)

    assert response.code == 200
    assert len(data['items']) == 2
    for item, mock_item in zip(data['items'], MOCK_WORKFLOWS['items']):
        assert item['id'] == mock_item['id']

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows'])
async def test_get_workflow(jp_fetch, endpoint, mock_get_workflow):
    params = {
        'workflow_id_or_name': 'mock_wf_id_1',
    }
    response = await jp_fetch(endpoint, params=params)
    data = json.loads(response.body)

    assert response.code == 200
    assert 'items' in data
    assert data.get('items')[0]['id'] == MOCK_WORKFLOWS['items'][0]['id']

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows/mock_wf_id_1/logs'])
async def test_get_workflow_logs(jp_fetch, endpoint, mock_get_workflow_logs):
    response = await jp_fetch(endpoint)
    data = json.loads(response.body)

    assert response.code == 200
    assert data == WF1_LOGS_RESPONSE

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows/mock_wf_id_1/workspace'])
async def test_get_workspace(jp_fetch, endpoint, mock_get_workspace):
    response = await jp_fetch(endpoint)
    data = json.loads(response.body)

    assert response.code == 200
    assert data == WF1_FILES_RESPONSE


@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows/mock_wf_id_1/workspace'])
async def test_get_workspace_deleted(jp_fetch, endpoint, mock_get_workspace_deleted):
    response = await jp_fetch(endpoint)
    data = json.loads(response.body)

    assert response.code == 200
    assert data['message'] == DELETED_WF_FILES['message']

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/workflows/mock_wf_id_1/specification'])
async def test_get_specification(jp_fetch, endpoint, mock_get_specification):
    response = await jp_fetch(endpoint)
    data = json.loads(response.body)

    assert response.code == 200
    assert data == WF1_SPECIFICATION

@pytest.mark.parametrize('endpoint', [f'/reana_jupyterlab/workflows/{MOCK_WF1["id"]}/workspace/{FILE_PATH}'])
async def test_download_files(jp_fetch, endpoint, mock_download_files):
    response = await jp_fetch(endpoint)
    data = json.loads(response.body)

    assert response.code == 200
    assert data['status'] == 'success'
    assert data['message'] == f'{FILE_PATH} downloaded'
    assert os.makedirs.called
    assert open.called
    assert open().write.called

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/validate'])
async def test_post_validate_success(jp_fetch, endpoint, mock_post_validate_success):
    data = {
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('message', '') == 'Validation successful'
    assert data.get('status', '') == 'success'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/validate'])
async def test_post_validate_error(jp_fetch, endpoint, mock_post_validate_error):
    data = {
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Validation failed'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/validate'])
async def test_post_validate_invalid_path(jp_fetch, endpoint, mock_post_validate_invalid_path):
    data = {
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Invalid path'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/validate'])
async def test_post_validate_not_yaml_file(jp_fetch, endpoint, mock_post_validate_not_yaml_file):
    data = {
        'path': '/path/to/workflow.txt'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Invalid path'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/run'])
async def test_post_create_success(jp_fetch, endpoint, mock_post_create_success):
    data = {
        'name': 'workflow',
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('message', '') == 'Workflow created'
    assert data.get('status', '') == 'success'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/run'])
async def test_post_create_error(jp_fetch, endpoint, mock_post_create_error):
    data = {
        'name': 'workflow',
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Workflow not created'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/run'])
async def test_post_create_invalid_path(jp_fetch, endpoint, mock_post_create_invalid_path):
    data = {
        'name': 'workflow',
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Invalid path'

@pytest.mark.parametrize('endpoint', ['/reana_jupyterlab/run'])
async def test_post_create_invalid_name(jp_fetch, endpoint, mock_post_create_success):
    data = {
        'name': 'workflow!?@',
        'path': '/path/to/workflow.yaml'
    }

    response = await jp_fetch(endpoint, method='POST', body=json.dumps(data))
    assert response.code == 200

    data = json.loads(response.body)
    assert data.get('status', '') == 'error'
    assert data.get('message', '') == 'Invalid workflow name'