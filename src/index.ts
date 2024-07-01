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

import { Widget } from '@lumino/widgets';

class ReanaWidget extends Widget {
  /**
  * Construct a new Reana widget.
  */
  constructor() {
    super();

    this.addClass('my-reanaWidget');

    // Add a summary element to the panel
    this.summary = document.createElement('p');
    this.node.appendChild(this.summary);
  }

  /**
  * The summary text element associated with the widget.
  */
  readonly summary: HTMLParagraphElement;

  async fillContent(): Promise<void> {
    this.summary.innerText = "Hello, Reana!";
    return;
  }
}

/**
* Activate the Reana widget extension.
*/
function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer | null) {
  console.log('JupyterLab extension jupyterlab_reana is activated!');

  // Declare a widget variable
  let widget: MainAreaWidget<ReanaWidget>;

  // Add an application command
  const command: string = 'reana:open';
  app.commands.addCommand(command, {
    label: 'Start Reana',
    execute: () => {
      if (!widget || widget.isDisposed) {
        const content = new ReanaWidget();
        widget = new MainAreaWidget({ content });
        widget.id = 'reana-jupyterlab';
        widget.title.label = 'Reana';
        widget.title.closable = true;
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the left work area if it's not there
        app.shell.add(widget, 'left');
      }
      widget.content.fillContent();

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
  let tracker = new WidgetTracker<MainAreaWidget<ReanaWidget>>({
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
  id: 'jupyterlab_reana',
  autoStart: true,
  requires: [ICommandPalette],
  optional: [ILayoutRestorer],
  activate: activate
};

export default plugin;
