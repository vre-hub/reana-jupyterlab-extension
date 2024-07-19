FROM ubuntu:20.04
LABEL maintainer="rubenperezm"

WORKDIR /app
SHELL ["/bin/bash", "-c"]

# Git clone the repository
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/vre-hub/reana-jupyterlab-extension.git
WORKDIR /app/reana-jupyterlab-extension

# Install Python
RUN apt-get install -y python3 python3-pip

# Install Node 20
RUN apt-get install -y curl
RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime \
    && echo $CONTAINER_TIMEZONE > /etc/timezone
RUN apt-get install -y software-properties-common npm
RUN npm install npm@latest -g && npm install n -g && n 20.15.1

# Install requirements and build the extension
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install -r requirements.txt

RUN jlpm && jlpm run build

RUN python3 -m pip install .
RUN jupyter server extension enable --py jupyterlab_reana

# Expose the port and run JupyterLab
EXPOSE 8888
CMD ["jupyter", "lab", "--ip='*'", "--NotebookApp.token=''", "--NotebookApp.password=''", "--no-browser", "--allow-root"]