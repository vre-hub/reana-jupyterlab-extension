import json
import pytest
from pathlib import Path
import shutil

ENDPOINT = '/reana_jupyterlab/files'

@pytest.fixture
def filespace():
    """
    test_workspace/
        folder1/
            file1.txt
            folder2/
                file2.csv
                file3.yaml
                folder3/
        file4.java
        file5.py
        file6.yaml
    """

    base_path = Path("./pytest_workspace").resolve()

    if base_path.exists():
        shutil.rmtree(base_path)
     
    folder3 = base_path / "folder1" / "folder2" / "folder3"
    folder3.mkdir(parents=True)

    # files
    (base_path / "file4.java").touch()
    (base_path / "file5.py").touch()
    (base_path / "file6.yaml").touch()
    (base_path / "folder1" / "file1.txt").touch()
    (base_path / "folder1" / "folder2" / "file2.csv").touch()
    (base_path / "folder1" / "folder2" / "file3.yaml").touch()

    yield base_path

    shutil.rmtree(base_path)

@pytest.mark.parametrize('path, expected', [
    ('pytest_workspace', {'entries': [{ 'name': 'file6.yaml', 'type': 'file', 'path': 'pytest_workspace/file6.yaml'}, {'name': 'folder1', 'type': 'directory', 'path': 'pytest_workspace/folder1'}]}),
    ('pytest_workspace/folder1', {'entries': [{'name': 'folder2', 'type': 'directory', 'path': 'pytest_workspace/folder1/folder2'}]}),
    ('pytest_workspace/folder1/folder2', {'entries': [{'name': 'file3.yaml', 'type': 'file', 'path': 'pytest_workspace/folder1/folder2/file3.yaml'}, {'name': 'folder3', 'type': 'directory', 'path': 'pytest_workspace/folder1/folder2/folder3'}]}),
    ('pytest_workspace/folder1/folder2/folder3', {'entries': []}),
    ('pytest_workspace/folder4', ''),
    ('pytest_workspace/file4.java', ''),
    ('pytest_workspace/folder1/../file6.yaml', '')
])
async def test_get_files(jp_fetch, path, expected, filespace):
    try:
        response = await jp_fetch(ENDPOINT, params={'path': path})
        assert response.code == 200
        data = json.loads(response.body)
        assert data == expected
    except Exception as e:
        assert e.code == 404