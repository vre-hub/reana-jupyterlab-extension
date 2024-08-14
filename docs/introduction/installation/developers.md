---
title: "Guide for developers"
parent: "Installation"
nav_order: 2
---

# Installation from source
The following instructions are for developers who want to install the extension from source.

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
jupyter server extension enable --py reana_jupyterlab
```

Finally, open a JupyterLab instance. The extension should be available in the JupyterLab sidebar.
```bash
jupyter lab
```