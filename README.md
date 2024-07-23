# Reana JupyterLab Extension
[![Install dependencies and build](https://github.com/vre-hub/reana-jupyterlab-extension/actions/workflows/build.yml/badge.svg)](https://github.com/vre-hub/reana-jupyterlab-extension/actions/workflows/build.yml/badge.svg)

Reana JupyterLab plugin provides a set of tools to interact with the [Reana](https://reanahub.io/) workflow management system from within JupyterLab. 

**This project is currently in development and is subject to change.**

## Requirements
- JupyterLab>=4,<5
- Notebook<7
- Node.js==20

## Installation
Install Python dependencies
```bash
python -m pip install -r requirements.txt
```

Install Yarn dependencies
```bash
jlpm install
```

Build the extension
```bash
jlpm run build
```

Install the extension
```bash
python -m pip install .
```

Enable the server extension
```bash
jupyter server extension enable --py jupyterlab_reana
```

Finally, open a JupyterLab instance. The extension should be available in the JupyterLab sidebar.
```bash
jupyter lab
```
