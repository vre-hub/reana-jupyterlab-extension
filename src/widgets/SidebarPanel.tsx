import { LabIcon } from '@jupyterlab/ui-components';
import { VDomRenderer } from '@jupyterlab/apputils';

import { createUseStyles } from 'react-jss';
import React, { useState, useEffect } from 'react';


import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';
import { MenuBar } from '../components/MenuBar';
import { Spinning } from '../components/Spinning';
import { ConnectionForm } from '../components/@Connection/ConnectionForm';
import { IReanaAuthCredentials } from '../types';
import { UIStore } from '../stores/UIStore';
import { useStoreState } from 'pullstate';
import { HorizontalHeading } from '../components/HorizontalHeading';

import { requestAPI } from '../utils/ApiRequest';


const useStyles = createUseStyles({
  panel: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
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
  },
  loading: {
    padding: '16px'
  },
  icon: {
    fontSize: '10px',
    verticalAlign: 'middle',
  },
  iconText: {
    verticalAlign: 'middle',
    paddingLeft: '4px'
  }
});


const Panel: React.FC = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      const populateUIStore = async () => {
        try{
          const data = await requestAPI<any>('env_variables', {
            method: 'GET',
          });
          
          UIStore.update(s => {
            s.authConfig = {
              server: data.server,
              accessToken: data.accessToken
            };
            //TODO: Check if I can store this value in the tmp file or if it is not necessary
            s.hasConnection = true;
          });

          setAuthConfig(data);
          setLoading(false)
        } catch (error) {
          console.error('Error setting variables:', error);
        }
      }
      populateUIStore().catch(console.error);
    };
  }, [loading]);

  const hasConnection = useStoreState(UIStore, s => s.hasConnection);

  const [activeMenu, setActiveMenu] = React.useState(2);
  const [authConfig, setAuthConfig] = React.useState<IReanaAuthCredentials>();

  const menus = [
    { title: 'Workflows', value: 1, right: false, disabled: !hasConnection },
    { title: 'Connect', value: 2, right: false }
  ];

  if (loading) {
    return (
      <div className={classes.loading}>
          <Spinning className={`${classes.icon} material-icons`}>
            hourglass_top
          </Spinning>
          <span className={classes.iconText}>Loading...</span>
      </div>
    );
  }

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

const PANEL_CLASS = 'jp-ReanaExtensionPanel';

export class SidebarPanel extends VDomRenderer {
  /**
  * Construct a new Reana widget.
  */

  constructor() {
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
  }

  render(): React.ReactElement {
    return <Panel />;
  }
}