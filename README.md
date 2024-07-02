# Reana JupyterLab Extension
Reana JupyterLab plugin provides a set of tools to interact with the [Reana](https://reanahub.io/) workflow management system from within JupyterLab. 

**This project is currently in development and is subject to change.**

## Requirements
- JupyterLab>=4,<5
- Node.js==20

## Installation
Install Python dependencies
```bash
python -m pip install requirements.txt
```

Install Yarn dependencies
```bash
jlpm install
```

Install the extension
```bash
python -m pip install .
```

Finally, open a JupyterLab instance. The extension should be available in the JupyterLab sidebar.
```bash
jupyter lab
```
