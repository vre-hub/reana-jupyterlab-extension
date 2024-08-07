import React, { useState } from 'react';
import { TextField } from '../TextField';
import { createUseStyles } from 'react-jss';

import { IReanaCreateParams } from '../../types';
import { Button } from '../Button';
import { requestAPI } from '../../utils/ApiRequest';

import { Notification } from '@jupyterlab/apputils';
import { HorizontalHeading } from '../HorizontalHeading';

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
    buttonsContainer: {
        extend: 'textFieldContainer',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        marginRight: '8px'
    },
    transparent: {
        opacity: 0.5
    },
    panel: {
        maxHeight: '40vh',
        overflow: 'auto',
        width: '100%',
        marginTop: '8px',
    },
    outputText: {
        padding: '0 8px',
    },
    errorPanel: {
        extend: 'panel',
        backgroundColor: 'var(--isabelline)'
    },
    successPanel: {
        extend: 'panel',
        backgroundColor: 'var(--light-teal)'
    }
});

interface ICreateProps {
    params?: IReanaCreateParams;
    onParamsChange: { (val: IReanaCreateParams): void };
}

type MyProps = ICreateProps & React.HTMLAttributes<HTMLDivElement>;

export const CreateForm: React.FC<MyProps> = ({
    params = { name: '', path: '' },
    onParamsChange,
}) => {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState({message: '', status: ''});

    const onNameChange = (name: string) => {
        onParamsChange({ ...params, name });
    };

    const onPathChange = (path: string) => {
        onParamsChange({ ...params, path });
    };


    const createWorkflow = async (name: string, path: string) => {
        setLoading(true);
        try {
            const data = await requestAPI<any>('run', {
                method: 'POST',
                body: JSON.stringify({ name, path }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            setOutput(data);
    
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

    const validateWorkflow = async (path: string) => {
        setLoading(true);
        try {
            const data = await requestAPI<any>('validate', {
                method: 'POST',
                body: JSON.stringify({ path }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setOutput(data);
    
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
                <div className={classes.buttonsContainer}>
                    <Button 
                        onClick={() => validateWorkflow(params.path)}
                        className={classes.button}
                        disabled={loading}
                    >
                        Validate
                    </Button>
                    <Button 
                        onClick={() => createWorkflow(params.name, params.path)}
                        disabled={loading}
                    >
                        Create & Run
                    </Button>
                </div>
                {
                    !loading && output.status !== '' &&
                    <>
                        <HorizontalHeading title="Output" />
                        <div className={output.status === 'success' ? classes.successPanel : classes.errorPanel}>
                            <pre className={classes.outputText}>{output.message}</pre>
                        </div>
                    </>
                }
            </div>
        </>
    );
};