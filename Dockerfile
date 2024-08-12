FROM quay.io/jupyter/scipy-notebook:python-3.11.8
LABEL maintainer="rubenperezm"

SHELL ["/bin/bash", "-c"]

# Git clone the repository
COPY . /reana-jupyterlab-extension
WORKDIR /reana-jupyterlab-extension

# Install Node
RUN conda upgrade -c conda-forge nodejs

# Install requirements and build the extension
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt

USER root
RUN jlpm && jlpm run build

RUN python3 -m pip install .
RUN jupyter server extension enable --py reana_jupyterlab
USER $NB_UID

WORKDIR /home/jovyan

# Expose the port and run JupyterLab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip='*'", "--NotebookApp.token=''", "--NotebookApp.password=''", "--no-browser", "--allow-root"]