import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_reana extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_reana:plugin',
  description: 'Reana JupyterLab plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_reana is activated!');
  }
};

export default plugin;
