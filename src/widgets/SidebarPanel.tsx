import { LabIcon } from '@jupyterlab/ui-components';
import { VDomRenderer } from '@jupyterlab/apputils';

import { createUseStyles } from 'react-jss';
import React, { useState, useEffect } from 'react';


import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';
import { MenuBar } from '../components/MenuBar';
import { Loading } from '../components/Loading';
import { ConnectionForm } from '../components/@Connection/ConnectionForm';
import { CreateForm } from '../components/@Create/CreateForm';
import { WorkflowList } from '../components/@Workflows/WorkflowsList';
import { IReanaAuthCredentials, IReanaWorkflow, IReanaWorkflowStatus, IReanaCreateParams } from '../types';
import { UIStore } from '../stores/UIStore';
import { useStoreState } from 'pullstate';
import { HorizontalHeading } from '../components/HorizontalHeading';

import { requestAPI } from '../utils/ApiRequest';
import { WorkflowDetails } from '../components/@Workflows/WorkflowDetails';


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
  }
});


const Panel: React.FC = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (loading) {
      const populateUIStore = async () => {
        try{
          const data = await requestAPI<any>('env', {
            method: 'GET',
          });
          
          UIStore.update(s => {
            s.authConfig = {
              server: data.server,
              accessToken: data.accessToken
            };

            s.hasConnection = !!data.server;
          });

          setAuthConfig(data);
          
        } catch (error) {
          console.error('Error setting variables:', error);
        } finally {
          setLoading(false);
        }
      }
      populateUIStore().catch(console.error);
    };
  }, [loading]);

  const hasConnection = useStoreState(UIStore, s => s.hasConnection);

  const [activeMenu, setActiveMenu] = React.useState(1);
  const [authConfig, setAuthConfig] = React.useState<IReanaAuthCredentials>();
  const [workflows, setWorkflows] = React.useState<IReanaWorkflowStatus[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<IReanaWorkflow|undefined>();
  const [creationParamsConfig, setCreationParamsConfig] = React.useState<IReanaCreateParams>();

  const menus = [
    { title: 'Connect', value: 1, right: false },
    { title: 'Workflows', value: 2, right: false, disabled: !hasConnection },
    { title: 'Create', value: 3, right: false, disabled: !hasConnection }
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={classes.panel}>
      <Header />
      <div className={classes.container}>
        <div className={classes.menuBar}>
          <MenuBar menus={menus} value={activeMenu} onChange={setActiveMenu} />
        </div>
        <div className={activeMenu !== 1 ? classes.hidden : ''}>
          {activeMenu === 1 && (
            <div>
              <HorizontalHeading title="Connect to REANA" />
              <ConnectionForm
                params={authConfig}
                onAuthParamsChange={v => {setAuthConfig(v)}}
                actionAfterSubmit={() => setSelectedWorkflow(undefined)}
              />
            </div>
          )}
        </div>
        <div className={activeMenu !== 2 ? classes.hidden : ''}>
          {activeMenu === 2 && (
            <div>           
              {
                selectedWorkflow !== undefined ? (
                  <WorkflowDetails workflow={selectedWorkflow} setWorkflow={setSelectedWorkflow} />
                ) :
                <WorkflowList
                  workflows={workflows}
                  setWorkflows={setWorkflows}
                  setSelectedWorkflow={setSelectedWorkflow}
                />
              }    
            </div>    
          )}
        </div>
        <div className={activeMenu !== 3 ? classes.hidden : ''}>
          {activeMenu === 3 && (
            <div>
              <HorizontalHeading title="Create a Reana workflow" />
              <CreateForm
                params={creationParamsConfig}
                onParamsChange={v => {setCreationParamsConfig(v)}}
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