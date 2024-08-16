MOCK_WF1 = {
    "id": "mock_wf_id_1",
    "name": "mock_wf_name.1",
    "status": "running",
    "created": "2020-10-10T10:10:10",
    "progress": {},
}

MOCK_WF2 = {
    "id": "mock_wf_id_2",
    "name": "mock_wf_name.2",
    "status": "finished",
    "created": "2020-10-10T10:10:10",
    "progress": {},
}

MOCK_WORKFLOWS = {
    "items": [MOCK_WF1, MOCK_WF2],
}

WF1_LOGS = {
    "logs": '{"workflow_logs":"engine_logs","job_logs":[{"step_1_id":{},"step_2_id":{}}]}'    
}

WF1_LOGS_RESPONSE = {
    "engineLogs": "engine_logs",
    "jobLogs": [{"step_1_id": {}, "step_2_id": {}}]
}

WF1_FILES = {
    "items": [
        {
            'name': 'file1',
            'last-modified': '2020-10-10T10:10:10',
            'size': {'human_readable': '10MB'},
        },
        {
            'name': 'file2',
            'last-modified': '2020-10-10T10:10:10',
            'size': {'human_readable': '20MB'},
        },
    ]
}

WF1_FILES_RESPONSE = {
    "files": [
        {
            'name': 'file1',
            'lastModified': '2020-10-10T10:10:10',
            'size': '10MB',
        },
        {
            'name': 'file2',
            'lastModified': '2020-10-10T10:10:10',
            'size': '20MB',
        },
    ]
}

WF1_SPECIFICATION = {
    "parameters": {"param1": "value1"},
    "specification": {"jobs": "job1"},
}

FILE_PATH = 'file1'
FILE_CONTENT = b'file1 content'
