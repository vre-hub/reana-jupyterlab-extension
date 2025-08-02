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
    ('pytest_workspace', set([('folder1', 'directory', 'pytest_workspace/folder1'), ('file6.yaml', 'file', 'pytest_workspace/file6.yaml')])),
    ('pytest_workspace/folder1', set([('folder2', 'directory', 'pytest_workspace/folder1/folder2')])),
    ('pytest_workspace/folder1/folder2', set([('file3.yaml', 'file', 'pytest_workspace/folder1/folder2/file3.yaml'), ('folder3', 'directory', 'pytest_workspace/folder1/folder2/folder3')])),
    ('pytest_workspace/folder1/folder2/folder3', set()),
    ('pytest_workspace/folder4', set()),
    ('pytest_workspace/file4.java', set()),
    ('pytest_workspace/folder1/../file6.yaml', set())
])
async def test_get_files(jp_fetch, path, expected, filespace):
    try:
        response = await jp_fetch(ENDPOINT, params={'path': path})
        assert response.code == 200

        data = json.loads(response.body)

        assert 'entries' in data
        entries = data['entries']

        assert isinstance(entries, list)

        received = set((entry['name'], entry['type'], entry['path']) for entry in entries)
        assert received == expected

        
    except Exception as e:
        print(e)
        assert e.code == 404