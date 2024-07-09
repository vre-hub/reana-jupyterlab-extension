import {
  ILabShell,
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { EXTENSION_ID } from './const';
import { SidebarPanel } from './widgets/SidebarPanel';

/**
* Activate the Reana widget extension.
*/
function activateSidebarPanel(
  app: JupyterFrontEnd,
  labShell: ILabShell,
) {
  console.log('JupyterLab extension jupyterlab_reana is activated!');

  const sidebarPanel = new SidebarPanel({ app });
  sidebarPanel.id = EXTENSION_ID + ':panel';
  labShell.add(sidebarPanel, 'left', { rank: 900 });
  labShell.activateById(sidebarPanel.id);

}

/**
 * Initialization data for the jupyterlab_reana extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ILabShell],
  activate: activateSidebarPanel
};

export default plugin;
