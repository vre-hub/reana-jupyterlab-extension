FROM quay.io/jupyter/scipy-notebook:python-3.11.8
LABEL maintainer="rubenperezm"

SHELL ["/bin/bash", "-c"]

# Git clone the repository
COPY . /reana-jupyterlab-extension
WORKDIR /reana-jupyterlab-extension

# Install Node, Python requirements and build the extension
RUN conda upgrade -c conda-forge nodejs && \
    python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt

USER root
RUN jlpm && jlpm run build && \
    python3 -m pip install . && \
    jupyter server extension enable --py reana_jupyterlab && \
    conda clean --al -y && \
    jlpm cache clean && \
    rm -rf /home/jovyan/.cache/yarn /root/.npm && \
    rm -rf /opt/conda/pkgs/*
USER $NB_UID

WORKDIR /home/jovyan

# Expose the port and run JupyterLab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip='*'", "--NotebookApp.token=''", "--NotebookApp.password=''", "--no-browser", "--allow-root"]