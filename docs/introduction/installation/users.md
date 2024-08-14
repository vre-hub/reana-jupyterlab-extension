---
title: "Guide for users"
parent: "Installation"
nav_order: 1
---

# Intallation via pip

To install the extension, run the following command:
```bash
pip install reana-jupyterlab
```

# Docker image
It is possible to run the extension in a Docker container. To download and run the image, use the following commands:
```bash
docker pull ghcr.io/vre-hub/reana-jupyterlab-extension:<version>
docker run -d -p 8888:8888 ghcr.io/vre-hub/reana-jupyterlab-extension
```

All the available versions can be found [here](https://github.com/vre-hub/reana-jupyterlab-extension/pkgs/container/reana-jupyterlab-extension).