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
        fontSize: '15px',
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
    workflowId: string;
    setWorkflowId: (workflowId: string) => void;
}

type MyProps = IWorkflowDetailsProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowDetails: React.FC<MyProps> = ({ workflowId, setWorkflowId }) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(true);
    const [workflow, setWorkflow] = useState<IReanaWorkflow | null>(null);
    const [activeMenu, setActiveMenu] = useState(1);
    const [isWide, setIsWide] = useState(false);

    useEffect(() => {
        const sidebar = document.getElementById('jupyterlab_reana:panel');

        if (!sidebar) {
            return;
        }

        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setIsWide(entry.contentRect.width > 600);
            }
        });

        resizeObserver.observe(sidebar);

        return () => {
            resizeObserver.disconnect();
        }

    }, []);
    const menus = [
        {
            title: <i className={`${classes.icon} material-symbols-outlined`}>arrow_back</i>,
            value: 0, right: false
        },
        {
            title: //<i className={`${classes.icon} material-symbols-outlined`}>info</i>,
                <div className={classes.menuItem}>
                    <i className={`${classes.icon} material-symbols-outlined`}>info</i>
                    {isWide && <span>Details</span>}
                </div>,
            value: 1, right: false
        },
        {
            title: //<i className={`${classes.icon} material-symbols-outlined`}>manufacturing</i>,
                <div className={classes.menuItem}>
                    <i className={`${classes.icon} material-symbols-outlined`}>manufacturing</i>
                    {isWide && <span>Engine logs</span>}
                </div>,
            value: 2, right: false
        },
        {
            title: //<i className={`${classes.icon} material-symbols-outlined`}>terminal</i>,
                <div className={classes.menuItem}>
                    <i className={`${classes.icon} material-symbols-outlined`}>terminal</i>
                    {isWide && <span>Job logs</span>}
                </div>,
            value: 3, right: false
        },
        {
            title: 
                <div className={classes.menuItem}>
                    <i className={`${classes.icon} material-symbols-outlined`}>folder</i>
                    {isWide && <span>Workspace</span>}
                </div>,
            value: 4, right: false
        },
        {
            title:
                <div className={classes.menuItem}>
                    <i className={`${classes.icon} material-symbols-outlined`}>code_blocks</i>
                    {isWide && <span>Specification</span>}
                </div>,
            value: 5, right: false
        }
    ];

    useEffect(() => {
        if (loading) {
            const populateWorkflow = async () => {
                try {
                    const dataStatus = await requestAPI<IReanaWorkflow>(`workflows/${workflowId}/status`, {
                        method: 'GET',
                    });
                    console.log(dataStatus);

                    const dataEngineLogs = await requestAPI<IReanaWorkflow>(`workflows/${workflowId}/logs`, {
                        method: 'GET',
                    });
                    console.log(dataEngineLogs);
                    setWorkflow({ ...workflow, ...dataStatus, ...dataEngineLogs });
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
                            <div>Status: {workflow?.status}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
