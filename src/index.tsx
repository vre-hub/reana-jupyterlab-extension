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

  const sidebarPanel = new SidebarPanel();
  sidebarPanel.id = EXTENSION_ID + ':panel';
  labShell.add(sidebarPanel, 'left', { rank: 900 });
  labShell.activateById(sidebarPanel.id);

  if (restorer) {
    restorer.add(sidebarPanel, sidebarPanel.id);
  }
}

/**
 * Initialization data for the reana_jupyterlab extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ILabShell],
  optional: [ILayoutRestorer],
  activate: activateSidebarPanel

};

export default plugin;
