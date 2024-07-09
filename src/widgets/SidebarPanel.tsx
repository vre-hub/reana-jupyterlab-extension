import { JupyterFrontEnd } from '@jupyterlab/application';
import { LabIcon } from '@jupyterlab/ui-components';
import { VDomRenderer } from '@jupyterlab/apputils';

import { createUseStyles } from 'react-jss';
import React from 'react';


import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';
import { ConnectionForm } from '../components/@Connection/ConnectionForm';
import { ReanaAuthCredentials } from '../types';
import { UIStore } from '../stores/UIStore';
import { useStoreState } from 'pullstate';


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
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto'
  },
  menuBar: {
    marginTop: '16px'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    '& > div': {
      height: '100%'
    }
  },
});

const Panel: React.FC = () => {
  const classes = useStyles();

  const isAuthenticated = useStoreState(UIStore, s => s?.authConfig !== null);

  // const menus = [
  //   { title: 'Your workflows', value: 1, right: false },
  // ]

  return (
    <div className={classes.panel}>
      <Header />
      <div className={classes.container}>
        {
          !isAuthenticated ? (
            <div className={classes.content}>
              <div className={classes.menuBar}>
                {/* <MenuBar menus={menus} /> */}
              </div>
              <div>
                <div>
                  <p>Workflows list</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={classes.content}>
              <div>
                <ConnectionForm />
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
}

export interface ISidebarPanelProps {
  app: JupyterFrontEnd;
}

const PANEL_CLASS = 'jp-ReanaExtensionPanel';

export class SidebarPanel extends VDomRenderer {
  /**
  * Construct a new Reana widget.
  */

  private app: JupyterFrontEnd;
  private isAuthenticated: boolean;

  constructor(options: ISidebarPanelProps) {
    super();
    super.addClass(PANEL_CLASS);
    super.title.caption = 'Reana extension for JupyterLab';
    super.title.closable = true;
    super.id = 'reana-jupyterlab';

    const ReanaIcon = new LabIcon({
      name: 'reana:icon',
      svgstr: reana_icon
    });

    super.title.icon = ReanaIcon.bindprops();

    const { app } = options;

    this.app = app;
    this.isAuthenticated = false;

    console.log(this.app)
    console.log(this.isAuthenticated)
  }

  protected login(auth: ReanaAuthCredentials): void {
    this.isAuthenticated = true;
    this.populateUIStore(auth);
    this.update();
  }

  protected logout(): void {
    this.isAuthenticated = false;
    this.populateUIStore(null);
    this.update();
  }

  private populateUIStore(auth: ReanaAuthCredentials | null): void {
    UIStore.update(s => {
      s.authConfig = auth;
    });
  }

  render(): React.ReactElement {
    return <Panel />;
  }
}