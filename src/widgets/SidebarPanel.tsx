import { LabIcon } from '@jupyterlab/ui-components';
import { VDomRenderer } from '@jupyterlab/apputils';

import { createUseStyles } from 'react-jss';
import React from 'react';

import reana_icon from '/src/images/reana-icon.svg';
import { Header } from '../components/Header';
import { MenuBar } from '../components/MenuBar';
import { CreateForm } from '../components/@Create/CreateForm';
import { WorkflowList } from '../components/@Workflows/WorkflowsList';
import { IReanaWorkflow, IReanaWorkflowStatus, IReanaCreateParams } from '../types';
import { HorizontalHeading } from '../components/HorizontalHeading';

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

  const [activeMenu, setActiveMenu] = React.useState(1);
  const [workflows, setWorkflows] = React.useState<IReanaWorkflowStatus[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<IReanaWorkflow|undefined>();
  const [creationParamsConfig, setCreationParamsConfig] = React.useState<IReanaCreateParams>();

  const menus = [
    { title: 'Workflows', value: 1, right: false },
    { title: 'Create', value: 2, right: false }
  ];

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
        <div className={activeMenu !== 2 ? classes.hidden : ''}>
          {activeMenu === 2 && (
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
