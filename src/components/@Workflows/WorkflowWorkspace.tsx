import { createUseStyles } from 'react-jss';
import React, { useEffect } from 'react';
import { IReanaWorkflow } from '../../types';
import { Loading } from '../Loading';

import { requestAPI } from '../../utils/ApiRequest';

import { WorkflowWorkspaceFile } from './WorkflowWorkspaceFile';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px 8px 16px'
    },
    message: {
        padding: '16px',
        textAlign: 'center'
    },
});

interface IWorkflowWorkspaceProps {
    workflow: IReanaWorkflow;
    setWorkflow: (workflow: IReanaWorkflow) => void;
}

type MyProps = IWorkflowWorkspaceProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowWorkspace: React.FC<MyProps> = ({ workflow, setWorkflow }) => {
    const classes = useStyles();

    useEffect(() => {
        const populateWorkflow = async () => {
            try {
                const dataWorkspace = await requestAPI<any>(`workflows/${workflow.id}/workspace`, {
                    method: 'GET',
                });
                console.log(dataWorkspace)
                setWorkflow({ ...workflow, ...dataWorkspace });
            } catch (e) {
                console.error(e);
            }
        }
        populateWorkflow();
    }, []);

    if (!workflow.files) {
        return <Loading />;
    }


    return (
        <div className={classes.content}>
            {workflow.files.map((file, index) => (
                <WorkflowWorkspaceFile
                    key={index}
                    file={file}
                    onClick={() => console.log('clicked')}
                />
            ))}
        </div>
    );
}