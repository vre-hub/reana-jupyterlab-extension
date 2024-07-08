import { JupyterFrontEnd } from '@jupyterlab/application';
import { LabIcon } from '@jupyterlab/ui-components';

import { createRoot, Root } from 'react-dom/client';
import { createUseStyles } from 'react-jss';

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';

import React from 'react';


import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';


const useStyles = createUseStyles({
    panel: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    icon: {
        fontSize: '10px',
        verticalAlign: 'middle',
    },
});

const Panel: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.panel}>
            <Header />
            <p>Hello from Reana! This is the panel</p>
        </div>
    );
}

export class SidebarPanel extends Widget {
    /**
    * Construct a new Reana widget.
    */
   
    private app: JupyterFrontEnd;
    private isAuthenticated: boolean;
    private root: Root | null = null;
  
    constructor(app: JupyterFrontEnd) {
      super();

      this.app = app;
      this.isAuthenticated = false;

      this.id = 'reana-jupyterlab';
      this.title.caption = 'Reana extension for JupyterLab';
      this.title.closable = true;

      const ReanaIcon = new LabIcon({
        name: 'reana:icon',
        svgstr: reana_icon
      });

      this.title.icon = ReanaIcon.bindprops();
    }
  
    protected onAfterAttach(msg: Message): void {
      super.onAfterAttach(msg);
      this.root = createRoot(this.node);
  
      // Render the React component
      console.log(this.app)
      console.log(this.isAuthenticated)
      this.root.render(<Panel />);
    }
  
    protected onBeforeDetach(msg: Message): void {
      super.onBeforeDetach(msg);
      if (this.root) {
        this.root.unmount();
      }
    }
  
    protected login(): void {
      this.isAuthenticated = true;
      this.update();
    }
  
    protected logout(): void {
      this.isAuthenticated = false;
      this.update();
    }
  
    render(): React.ReactElement {
        return <Panel />;
    }
  }