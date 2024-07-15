import {
  ILabShell,
  ILayoutRestorer,
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
  restorer: ILayoutRestorer | null
) {
  console.log('jupyterlab_reana: sidebar panel is activated!');

  const sidebarPanel = new SidebarPanel();
  sidebarPanel.id = EXTENSION_ID + ':panel';
  labShell.add(sidebarPanel, 'left', { rank: 900 });
  labShell.activateById(sidebarPanel.id);

  if (restorer) {
    restorer.add(sidebarPanel, sidebarPanel.id);
  }
}

/**
 * Initialization data for the jupyterlab_reana extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ILabShell],
  optional: [ILayoutRestorer],
  activate: activateSidebarPanel

};

export default plugin;
