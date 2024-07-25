FROM quay.io/jupyter/minimal-notebook:latest
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
RUN jupyter server extension enable --py jupyterlab_reana
USER $NB_UID

# Expose the port and run JupyterLab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip='*'", "--NotebookApp.token=''", "--NotebookApp.password=''", "--no-browser", "--allow-root"]