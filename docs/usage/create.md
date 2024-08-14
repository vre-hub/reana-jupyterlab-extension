---
title: "Create a new workflow"
parent: "Usage"
nav_order: 3
---


Users can create new workflows from the virtual environment by using the REANA extension. The extension provides a user-friendly interface for creating new workflows and managing existing ones. To create a new workflow, follow these steps:

1. Open the REANA extension by clicking on the REANA icon in the JupyterLab sidebar.
2. Click on the "Create" tab.
3. Enter the workflow name. The name does not need to be unique (it will be considered as a new run of the workflow). The extension will only accept alphanumeric characters and underscores.
4. Click on the folder icon in the "YAML file" field to select the YAML file that defines the workflow. It will open a file browser in the root directory of the virtual environment. After selecting the YAML file, the path to the file will be displayed in the field. If you want to select a different file, click on the folder icon again. If you want to remove the file, click on the "X" icon.
5. (Optional) You can validate the YAML file by clicking on the "Validate" button. The extension will check the syntax of the YAML file and display the output on the screen. If the output is an error, the message will be displayed in a red box, otherwise, it will be displayed in a blue box.
6. Click on the "Create & Run" button to create the workflow, upload the workspace and start the workflow. A message will be displayed, indicating that the workflow was created successfully (or the error). The workflow should be displayed in the "Workflows" tab of the extension.