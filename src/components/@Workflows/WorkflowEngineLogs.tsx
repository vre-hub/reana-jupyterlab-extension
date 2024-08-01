import { createUseStyles } from 'react-jss';
import React from 'react';
import { IReanaWorkflow } from '../../types';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px 8px 16px'
    },
    panel: {
        backgroundColor: 'var(--isabelline)',
        height: '45vh',
        overflow: 'auto',
        width: '100%'
    },
    message: {
        padding: '16px',
        textAlign: 'center'
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
            {
                workflow.engineLogs !== undefined && workflow.engineLogs !== ''
                ? 
                <pre className={classes.panel}>{workflow.engineLogs}</pre>
                :
                <p className={classes.message}>No logs available</p>
            }

        </div>
    );
}