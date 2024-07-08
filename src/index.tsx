import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette,
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

import { EXTENSION_ID } from './const';
import { SidebarPanel } from './widgets/SidebarPanel';

/**
* Activate the Reana widget extension.
*/
function activateSidebarPanel(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer | null
) {
  console.log('JupyterLab extension jupyterlab_reana is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<SidebarPanel>;

  // Add an application command
  const command: string = 'reana:open';
  app.commands.addCommand(command, {
    label: 'Start Reana',
    execute: () => {
      if (!widget || widget.isDisposed) {
        const content = new SidebarPanel(app);
        content.id = EXTENSION_ID + ':panel';
        widget = new MainAreaWidget({ content });
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the left work area if it's not there
        app.shell.add(widget, 'left');
      }

      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add shortcut
  app.commands.addKeyBinding({
    command: command,
    args: {},
    keys: ['Accel Alt R'],
    selector: 'body'
  });

  // Add the command to the palette.
  palette.addItem({ command, category: 'Reana' });

  // Track and restore the widget state
  let tracker = new WidgetTracker<MainAreaWidget<SidebarPanel>>({
    namespace: 'reana'
  });
  if (restorer) {
    restorer.restore(tracker, {
      command,
      name: () => 'reana'
    });
  }

}

/**
 * Initialization data for the jupyterlab_reana extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ILayoutRestorer],
  activate: activateSidebarPanel
};

export default plugin;
