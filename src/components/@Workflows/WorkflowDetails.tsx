import { createUseStyles } from 'react-jss';
import React, { useState, useEffect } from 'react';

import { MenuBar } from '../MenuBar';
import { Loading } from '../Loading';
// import { HorizontalHeading } from '../HorizontalHeading';

import { requestAPI } from '../../utils/ApiRequest';
import { IReanaWorkflow } from '../../types';
import { WorkflowEngineLogs } from './WorkflowEngineLogs';
import { WorkflowJobLogs } from './WorkflowJobLogs';
import { WorkflowOverview } from './WorkflowOverview';


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
    icon: {
        fontSize: '18px',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',

        '& span': {
            marginLeft: '2px',
            paddingBottom: '2px'
        }
    },

});

interface IWorkflowDetailsProps {
    workflow: IReanaWorkflow;
    setWorkflow: (workflowId: IReanaWorkflow|undefined) => void;
}

type MyProps = IWorkflowDetailsProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowDetails: React.FC<MyProps> = ({ workflow, setWorkflow }) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [workflowDetails, setWorkflowDetails] = useState<IReanaWorkflow>(workflow);
    const [activeMenu, setActiveMenu] = useState(1);
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        const sidebar = document.getElementById('jupyterlab_reana:panel');

        if (!sidebar) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setIsWide(entry.contentRect.width > 470);
            }
        });

        resizeObserver.observe(sidebar);

        return () => {
            resizeObserver.disconnect();
        }

    }, []);

    const menus = [
        {
            title:
                <div className={classes.menuItem} title='Engine logs'>
                    <i className={`${classes.icon} material-symbols-outlined`}>manufacturing</i>
                    {isWide && <span>Engine logs</span>}
                </div>,
            value: 1, right: false
        },
        {
            title:
                <div className={classes.menuItem} title='Job logs'>
                    <i className={`${classes.icon} material-symbols-outlined`}>terminal</i>
                    {isWide && <span>Job logs</span>}
                </div>,
            value: 2, right: false
        },
        {
            title:
                <div className={classes.menuItem} title='Workspace'>
                    <i className={`${classes.icon} material-symbols-outlined`}>folder</i>
                    {isWide && <span>Workspace</span>}
                </div>,
            value: 3, right: false
        },
        {
            title:
                <div className={classes.menuItem} title='Specification'>
                    <i className={`${classes.icon} material-symbols-outlined`}>code_blocks</i>
                    {isWide && <span>Specification</span>}
                </div>,
            value: 4, right: false
        }
    ];

    useEffect(() => {
        if (loading) {
            const populateWorkflow = async () => {
                try {
                    const dataEngineLogs = await requestAPI<IReanaWorkflow>(`workflows/${workflow.id}/logs`, {
                        method: 'GET',
                    });
                    setWorkflowDetails({ ...workflowDetails, ...dataEngineLogs });
                    setLoading(false);
                } catch (e) {
                    console.error(e);
                }
            }
            populateWorkflow();
        }
    }, [loading, workflow.id]);

    const refreshWorkflow = async () => {
        try {
            const updatedInfoWorkflow = await requestAPI<any>(`workflows?workflow_id_or_name=${workflow.id}`, {
                method: 'GET',
            });
            setWorkflowDetails({ ...workflowDetails, ...updatedInfoWorkflow?.items[0]});
            setLoading(true);
        }
        catch (e) {
            console.error(e);
        }
    }

    return (
        <div>
            <WorkflowOverview 
                workflow={workflowDetails}
                setWorkflow={setWorkflow}
                refresh={async () => { await refreshWorkflow() }} 
                isWide={isWide}
            />
            <div className={classes.menuBar}>
                <MenuBar menus={menus} value={activeMenu} onChange={setActiveMenu} />
            </div>
            <div className={classes.container}>
                {loading || !workflowDetails ? <Loading /> : (
                    <div className={classes.content}>
                        {activeMenu === 1 && <WorkflowEngineLogs workflow={workflowDetails} />}
                        {activeMenu === 2 && <WorkflowJobLogs workflow={workflowDetails} />}
                        { activeMenu === 3 && <div>
                            <div>ID: {workflowDetails?.id}</div>
                            <div>Name: {workflowDetails?.name}</div>
                            <div>Run: {workflowDetails?.run}</div>
                            <div>Status: {workflowDetails?.status}</div>
                        </div> }
                    </div>
                )}
            </div>
        </div>
    );
}
