import { createUseStyles } from 'react-jss';
import React from 'react';
import { IReanaWorkflow } from '../../types';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px 8px 16px'
    },
    panel: {
        backgroundColor: 'var(--isabelline)',
        height: '500px',
        overflow: 'auto',
        width: '100%'
    }
});

interface IWorkflowEngineLogsProps {
    workflow: IReanaWorkflow;
}

type MyProps = IWorkflowEngineLogsProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowEngineLogs: React.FC<MyProps> = ({ workflow }) => {
    const classes = useStyles();

    return (
        <div className={classes.content}>
            <pre className={classes.panel}>{workflow.engineLogs}</pre>
        </div>
    );
}