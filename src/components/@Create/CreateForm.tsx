import React, { useState } from 'react';
import { TextField } from '../TextField';
import { createUseStyles } from 'react-jss';

import { IReanaCreateParams } from '../../types';
import { Button } from '../Button';
import { requestAPI } from '../../utils/ApiRequest';

import { Notification } from '@jupyterlab/apputils';
import { HorizontalHeading } from '../HorizontalHeading';
import { FileBrowser } from '../FileBrowser';

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
    groupContainer: {
        display: "flex",
        alignItems: "stretch",
    },
    fileBrowserTextFieldContainer: {
        flexGrow: 1,
        marginRight: '2px',
        minWidth: 0
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
        maxHeight: '30vh',
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
    },
    icon: {
        fontSize: '18px'
    },
    textFieldButton: {
        cursor: 'pointer',
        alignItems: 'center',
        padding: '8px 8px 8px 4px',
        lineHeight: 0,
    },
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
    const [output, setOutput] = useState({ message: '', status: '' });
    const [openFileBrowser, setOpenFileBrowser] = useState(false);

    const onNameChange = (name: string) => {
        onParamsChange({ ...params, name });
    };

    const onPathChange = (path: string) => {
        onParamsChange({ ...params, path });
        setOpenFileBrowser(false);
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

    const openFileBrowserButton = (
        <div className={classes.textFieldButton} onClick={() => {setOpenFileBrowser(!openFileBrowser)}}>
            <i className={`${classes.icon} material-symbols-outlined`}>folder_open</i>
        </div>
    );

    const unsetPathButton = (
        <div className={classes.textFieldButton} onClick={() => onPathChange('')}>
            <i className={`${classes.icon} material-symbols-outlined`}>close</i>
        </div>
    );

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
                    <div className={classes.label}>YAML File</div>
                            <TextField
                                placeholder="No file selected"
                                readOnly
                                disabled={loading}
                                value={params.path}
                                after={params.path === '' ? openFileBrowserButton : [unsetPathButton, openFileBrowserButton]}
                            />
                </div>

                {openFileBrowser && <FileBrowser onSelectFile={onPathChange} />}

                <div className={classes.buttonsContainer}>
                    <Button
                        onClick={() => validateWorkflow(params.path)}
                        className={classes.button}
                        disabled={loading || params.path === '' || params.name === ''}
                    >
                        Validate
                    </Button>
                    <Button
                        onClick={() => createWorkflow(params.name, params.path)}
                        disabled={loading || params.path === '' || params.name === ''}
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