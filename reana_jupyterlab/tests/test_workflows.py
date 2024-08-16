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