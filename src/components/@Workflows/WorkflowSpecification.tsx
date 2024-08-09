import { createUseStyles } from 'react-jss';
import React, { useEffect } from 'react';
import { IReanaWorkflow } from '../../types';
import { Loading } from '../Loading';

import { requestAPI } from '../../utils/ApiRequest';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px 8px 16px'
    },
    panel: {
        backgroundColor: 'var(--isabelline)',
        overflow: 'auto',
        width: '100%'
    },
    paramsPanel: {
        extend: 'panel',
        maxHeight: '15vh'
    },
    specPanelShared: {
        extend: 'panel',
        height: '35vh'
    },
    specPanelAlone: {
        extend: 'panel',
        height: '55vh'
    },
    message: {
        padding: '16px',
        textAlign: 'center'
    },
    title: {
        margin: '8px 0'
    }
});

interface IWorkflowSpecificationProps {
    workflow: IReanaWorkflow;
    setWorkflow: (workflow: IReanaWorkflow) => void;
}

type MyProps = IWorkflowSpecificationProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowSpecification: React.FC<MyProps> = ({ workflow, setWorkflow }) => {
    const classes = useStyles();

    useEffect(() => {
        if (!workflow.specification) {
            const populateWorkflow = async () => {
                try {
                    const dataSpecification = await requestAPI<IReanaWorkflow>(`workflows/${workflow.id}/specification`, {
                        method: 'GET',
                    });
                    setWorkflow({ ...workflow, ...dataSpecification });
                } catch (e) {
                    console.error(e);
                }
            }
            populateWorkflow();
        }
    }, [workflow]);

    if (!workflow.specification) {
        return <Loading />;
    }

    const hasRuntimeParams = Object.keys(workflow.parameters).length > 0;
    
    return (
        <div className={classes.content}>
            {
                hasRuntimeParams &&
                <>
                    <h4 className={classes.title}>Runtime parameters</h4>
                    <pre className={classes.paramsPanel}>{JSON.stringify(workflow.parameters, null, 2)}</pre>
                    <h4 className={classes.title}>Workflow specification</h4>
                </>
            }
            <pre 
                className={
                    hasRuntimeParams
                    ?
                    classes.specPanelShared
                    :
                    classes.specPanelAlone
                }
            >
                {JSON.stringify(workflow.specification, null, 2)}
            </pre>
        </div>
    );
}