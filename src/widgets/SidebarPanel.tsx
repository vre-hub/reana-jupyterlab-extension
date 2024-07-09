import { JupyterFrontEnd } from '@jupyterlab/application';
import { LabIcon } from '@jupyterlab/ui-components';
import { VDomRenderer } from '@jupyterlab/apputils';

import { createUseStyles } from 'react-jss';
import React from 'react';


import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';
import { MenuBar } from '../components/MenuBar';
import { ConnectionForm } from '../components/@Connection/ConnectionForm';
import { IReanaAuthCredentials } from '../types';
import { UIStore } from '../stores/UIStore';
import { useStoreState } from 'pullstate';
import { HorizontalHeading } from '../components/HorizontalHeading';


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
  hidden: {
    display: 'none'
  }
});

const Panel: React.FC = () => {
  const classes = useStyles();

  const reanaAuthParams = useStoreState(UIStore, s => s.authConfig);
  const hasConnection = useStoreState(UIStore, s => s.hasConnection);

  const [activeMenu, setActiveMenu] = React.useState(2);
  const [authConfig, setAuthConfig] = React.useState<IReanaAuthCredentials>(reanaAuthParams);

  const menus = [
    { title: 'Your workflows', value: 1, right: false, disabled: !hasConnection },
    { title: 'Connection settings', value: 2, right: false }
  ]

  return (
    <div className={classes.panel}>
      <Header />
      <div className={classes.container}>
        <div className={classes.menuBar}>
          <MenuBar menus={menus} value={activeMenu} onChange={setActiveMenu} />
        </div>
        <div className={activeMenu !== 1 ? classes.hidden : ''}>
          {activeMenu === 1 && <p>Your Workflows list</p>}
        </div>
        <div className={activeMenu !== 2 ? classes.hidden : ''}>
          {activeMenu === 2 && (
            <div>
              <HorizontalHeading title="Connect to REANA" />
              <ConnectionForm
                params={authConfig}
                onAuthParamsChange={v => setAuthConfig(v)}
              />
            </div>
          )}

        </div>
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

  render(): React.ReactElement {
    return <Panel />;
  }
}