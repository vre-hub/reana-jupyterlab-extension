# Reana JupyterLab Extension
Reana JupyterLab plugin provides a set of tools to interact with the [Reana](https://reanahub.io/) workflow management system from within JupyterLab. 

**This project is currently in development and is subject to change.**

## Requirements
- JupyterLab>=4,<5
- Notebook<7
- Node.js==20
- Reana-Client>=0.9.0

## Installation
Install Python dependencies
```bash
pip install -r requirements.txt
```

Install Yarn dependencies
```bash
jlpm install
```

Install the extension
```bash
pip install .
```

Enable the server extension
```bash
jupyter server extension enable --py reana_jupyterlab
```

Finally, open a JupyterLab instance. The extension should be available in the JupyterLab sidebar.
```bash
jupyter lab
```
