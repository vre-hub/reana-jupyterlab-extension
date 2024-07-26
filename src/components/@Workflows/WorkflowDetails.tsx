import { createUseStyles } from 'react-jss';
import React, { useState, useEffect } from 'react';

import { MenuBar } from '../MenuBar';
import { Loading } from '../Loading';
import { HorizontalHeading } from '../HorizontalHeading';

import { requestAPI } from '../../utils/ApiRequest';
import { IReanaWorkflow } from '../../types';


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
        fontSize: '14px'
    }
});

interface IWorkflowDetailsProps {
    workflowId: string;
    setWorkflowId: (workflowId: string) => void;
}

type MyProps = IWorkflowDetailsProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowDetails: React.FC<MyProps> = ({ workflowId, setWorkflowId }) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState<IReanaWorkflow | null>(null);
    const [activeMenu, setActiveMenu] = useState(1);

    const menus = [
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>arrow_back</i>,
            value: 0, right: false
        },
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>info</i>,
            value: 1, right: false
        },
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>manufacturing</i>,
            value: 2, right: false
        },
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>terminal</i>,
            value: 3, right: false
        },
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>folder</i>,
            value: 4, right: false
        },
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>code_blocks</i>,
            value: 5, right: false
        }
    ];

    useEffect(() => {
        if (loading) {
                const populateWorkflow = async () => {
                    try {
                        const data = await requestAPI<IReanaWorkflow>(`workflows/${workflowId}/status`, {
                            method: 'GET',
                        });
                        console.log(data);
                        setWorkflow(data);
                        setLoading(false);
                    } catch (e) {
                        console.error(e);
                    }
                }
                populateWorkflow();
            }
    }, [loading, workflowId]);

    useEffect(() => {
        if (activeMenu === 0) {
            setWorkflowId('');
        }
    }, [activeMenu]);

    return (
        <div>
            <HorizontalHeading title="Workflow Details" />
            <div className={classes.menuBar}>
                <MenuBar menus={menus} value={activeMenu} onChange={setActiveMenu} />
            </div>
            <div className={classes.container}>
                {loading ? <Loading /> : (
                    <div className={classes.content}>
                        <div>
                            <div>ID: {workflow?.id}</div>
                            <div>Name: {workflow?.name}</div>
                            <div>Run: {workflow?.run}</div>
                            {workflow?.createdAt && <div>Created: {new Date(workflow.createdAt).toLocaleString()}</div>}
                            {workflow?.startedAt && <div>Started: {new Date(workflow.startedAt).toLocaleString()}</div>}
                            {workflow?.finishedAt && <div>Finished: {new Date(workflow.finishedAt).toLocaleString()}</div>}
                            {workflow?.stoppedAt && <div>Stopped: {new Date(workflow.stoppedAt).toLocaleString()}</div>}
                            <div>Status: {workflow?.status}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
