import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Loading } from '../Loading';

import { IReanaWorkflow } from '../../types';
import { requestAPI } from '../../utils/ApiRequest';

const useStyles = createUseStyles({
    container: {
        padding: '8px 16px 8px 16px'
    },
    label: {
        margin: '4px 0 4px 0'
    },
    textFieldContainer: {
        margin: '8px 0 8px 0'
    },
});

interface IConnectionProps {
    workflows?: IReanaWorkflow[];
    setWorkflows: { (val: IReanaWorkflow[]): void };
}

type MyProps = IConnectionProps & React.HTMLAttributes<HTMLDivElement>;



export const WorkflowList: React.FC<MyProps> = ({
    workflows = [],
    setWorkflows,
}) => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        if (loading) {
            const populateWorkflows = async () => {
                try {
                    const data = await requestAPI<any>('workflows', {
                        method: 'GET',
                    });

                    setWorkflows(data);
                } catch (error) {
                    console.error('Error setting variables:', error);
                } finally {
                    setLoading(false);
                }
            }
            populateWorkflows().catch(console.error);
        };
    }, [loading]);


    if (loading) {
        return <Loading />;
    }

    return ( 
        workflows.length === 0 ? 
        <div>No workflows found</div> :

        <div className={classes.container}>
            <h3>Workflows</h3>
            {workflows.map((workflow, index) => (
                <div key={index}>
                    <p>{workflow.name}</p>
                </div>
            ))}
        </div>
    );
};

