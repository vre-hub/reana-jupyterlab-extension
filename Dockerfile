FROM quay.io/jupyter/scipy-notebook:python-3.11.8
LABEL author="VRE Team @ CERN 2024"
LABEL maintainer="rubenperezm"

SHELL ["/bin/bash", "-c"]

# Git clone the repository
COPY . /reana-jupyterlab-extension
WORKDIR /reana-jupyterlab-extension

# Setup
USER root
RUN conda upgrade -c conda-forge nodejs && \
    python3 -m pip install --upgrade pip && \
    python3 -m pip install -r requirements.txt && \
    jlpm && jlpm run build && \
    python3 -m pip install . && \
    jupyter server extension enable --py reana_jupyterlab && \
    conda clean --all -y && \
    jlpm cache clean && \
USER $NB_UID

WORKDIR /home/jovyan

# # Expose the port and run JupyterLab
# EXPOSE 8888
# CMD ["jupyter", "lab", "--ip='*'", "--NotebookApp.token=''", "--NotebookApp.password=''", "--no-browser", "--allow-root"]
CMD ["start-notebook.py"]