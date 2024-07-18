import os
import json
import time
from getpass import getpass
from reana_client.api.client import (
    create_workflow_from_json,
    download_file,
    get_workflow_logs,
    get_workflow_status,
    list_files,
    ping,
    start_workflow,
    upload_to_server,
)
os.environ['REANA_SERVER_URL'] = 'https://reana-vre.cern.ch'

my_reana_token = 'API_KEY'

my_workflow_name = 'reana-client-test-workflow'
workflow_type = 'serial'

my_inputs = {
    'files': [
        'code/gendata.C',
        'code/fitdata.C'
    ],  # A list of files your analysis will be using
    'parameters': {
        'events': '20000',
        'data': 'results/data.root',
        'plot': 'results/plot.png',
    }  # Parameters your workflow takes
}

# Serial workflow definition
workflow = {
    'steps': [
        {'name': 'gendata',
         'environment': 'reanahub/reana-env-root6:6.18.04',
         'commands': [
           'mkdir -p results',
           'root -b -q \'code/gendata.C(${events},"${data}")\' | tee gendata.log']},
        {'name': 'fitdata',
         'environment': 'reanahub/reana-env-root6:6.18.04',
         'commands': [
           'root -b -q \'code/fitdata.C("${data}","${plot}")\' | tee fitdata.log']}]
}

# If ping is uncommented, ping fails but the workflow is created and executed.
# If ping is commented, the workflow is not created.

# print('Testing connection...')
# print(ping(my_reana_token))

# Create our workflow REANA
print('Creating workflow...')
print(create_workflow_from_json(
    workflow_json=workflow,
    name=my_workflow_name,
    access_token=my_reana_token,
    parameters=my_inputs,
    workflow_engine=workflow_type))

# Upload files to the workflow workspace
print('Uploading files...')
abs_path_to_input_files = \
  [os.path.abspath(f) for f in my_inputs['files']]
upload_to_server(my_workflow_name,
                 abs_path_to_input_files,
                 my_reana_token)

# Start workflow
print('Starting workflow...')
print(start_workflow(my_workflow_name, my_reana_token, {}))

# Check workflow status
while True:
  status_details = get_workflow_status(my_workflow_name, my_reana_token)
  print('Current status: ', status_details['status'])
  if status_details['status'] == 'finished':
    break
  time.sleep(10)

# Check logs
print('Workflow logs:')
wf_logs = get_workflow_logs(my_workflow_name, my_reana_token, ['gendata', 'fitdata'])
print(json.dumps(wf_logs, indent=2))


# List files in the workspace
list_files(my_workflow_name, my_reana_token)

# Download the output file
output_filename = 'results/plot.png'
file_binary_blob = download_file(
  my_workflow_name, output_filename, my_reana_token)