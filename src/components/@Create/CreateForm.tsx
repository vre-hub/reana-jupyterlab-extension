import React, { useState } from 'react';
import { TextField } from '../TextField';
import { createUseStyles } from 'react-jss';

import { IReanaCreateParams } from '../../types';
import { Button } from '../Button';
import { requestAPI } from '../../utils/ApiRequest';

import { Notification } from '@jupyterlab/apputils';

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
    transparent: {
        opacity: 0.5
    }
});

interface ICreateProps {
    params?: IReanaCreateParams;
    onParamsChange: { (val: IReanaCreateParams): void };
}

type MyProps = ICreateProps & React.HTMLAttributes<HTMLDivElement>;

export const CreateForm: React.FC<MyProps> = ({
    params = { name: '', path: '', runtimeParams: {} },
    onParamsChange,
}) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);

    const onNameChange = (name: string) => {
        onParamsChange({ ...params, name });
    };

    const onPathChange = (path: string) => {
        onParamsChange({ ...params, path });
    };

    const createWorkflow = async (name: string, path: string, runtimeParams: Object) => {
        setLoading(true);
        try {
            const data = await requestAPI<any>('run', {
                method: 'POST',
                body: JSON.stringify({ name, path }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            Notification.emit(
                data.message,
                data.status,
                {
                    autoClose: 3000,
                }
            );
    
        } catch (error) {
            Notification.error(
                'Connection Error',
                {
                    autoClose: 3000,
                }
            )
        } finally {
            setLoading(false);
        }
    
    }

    return (
        <>
            <div className={`${classes.container} ${loading ? classes.transparent : ''}`}>
                <div className={classes.textFieldContainer}>
                    <div className={classes.label}>Workflow Name</div>
                    <TextField
                        placeholder="Workflow Name"
                        disabled={loading}
                        value={params.name}
                        onChange={e => onNameChange(e.target.value)}
                    />
                </div>
                <div className={classes.textFieldContainer}>
                    <div className={classes.label}>Path</div>
                    <TextField
                        placeholder="Path"
                        disabled={loading}
                        value={params.path}
                        onChange={e => onPathChange(e.target.value)}
                    />
                </div>
                <div className={classes.textFieldContainer}>
                    <Button 
                        onClick={() => createWorkflow(params.name, params.path, params.runtimeParams)}
                        disabled={loading}
                    >
                        Create & Run
                    </Button>
                </div>
            </div>
        </>
    );
};