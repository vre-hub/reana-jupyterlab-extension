import { createUseStyles } from 'react-jss';
import React, { useEffect, useState } from 'react';
import { IReanaWorkflow } from '../../types';
import { WORKSPACE_PAGE_SIZE } from '../../const';

import { Loading } from '../Loading';
import { Pagination } from '../Pagination';
import { TextField } from '../TextField';
import { Button } from '../Button';

import { requestAPI } from '../../utils/ApiRequest';
import { Notification } from '@jupyterlab/apputils';

import { WorkflowWorkspaceFile } from './WorkflowWorkspaceFile';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px'
    },
    filesContainer: {
        height: '400px'
    },
    tableHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '8px 33px 8px 40px',
        border: '1px solid var(--jp-border-color2)',
    },
    title: {
        fontSize: '10pt',
        fontWeight: 600,
    },

    fileTitle: {
        extend: 'title',
        flex: 2
    },
    sizeTitle: {
        extend: 'title',
        padding: '0 8px',
        flex: 1
    },
    lastModifiedTitle: {
        extend: 'title',
        flex: 1
    },
    groupContainer: {
        display: "flex",
        alignItems: "stretch",
        padding: '8px 0'
    },
    searchContainer: {
        flexGrow: 1,
        marginRight: '2px',
        minWidth: 0
    },
    searchButton: {
        alignItems: 'center',
        padding: '8px 8px 8px 4px',
        lineHeight: 0,
    },
    searchIcon: {
        fontSize: '18px',
    },
    downloadIcon: {
        fontSize: '18px',
    },
    actionsButton: {
        alignItems: 'center',
        cursor: 'pointer',
        '&:hover': {
            background: 'var(--jp-layout-color2)'
        }
    },
    buttonContent: {
        display: 'flex',
        alignItems: 'center',

        '& span': {
            marginLeft: '2px',
            paddingTop: '2px'
        }
    },
    transparent: {
        opacity: 0.5
    }
});

interface IWorkflowWorkspaceProps {
    workflow: IReanaWorkflow;
    setWorkflow: (workflow: IReanaWorkflow) => void;
    isSidebarWide: boolean;
}

type MyProps = IWorkflowWorkspaceProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowWorkspace: React.FC<MyProps> = ({ workflow, setWorkflow, isSidebarWide }) => {
    const classes = useStyles();
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [navigation, setNavigation] = useState({ hasNext: false, hasPrev: false, total: 0 });
    const [query, setQuery] = useState('');
    const [lastQuery, setLastQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const searchButton = (
        <div className={classes.searchButton}>
            <i className={`${classes.searchIcon} material-symbols-outlined`}>search</i>
        </div>
    );

    useEffect(() => {
        if (loading) {
            const populateWorkflow = async () => {
                try {
                    const wfName = workflow.name + '.' + workflow.run;
                    const dataWorkspace = await requestAPI<any>(`workflows/${wfName}/workspace?page=${page}&search=${query}`, {
                        method: 'GET',
                    });
                    setWorkflow({ ...workflow, ...dataWorkspace });
                    setNavigation({...navigation, ...dataWorkspace});
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);  
                }
            }
            populateWorkflow();
        }
    }, [loading]);

    useEffect(() => {
        setPage(1);
        setLoading(true);
    }, [lastQuery]);


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLastQuery(query);
        }
    };

    const download = async () => {
        setDownloadLoading(true);
        try {
            let files = selectedFiles;
            if (selectedFiles.length === 0) {
                const dataWorkspace = await requestAPI<any>(`workflows/${workflow.id}/workspace`, {
                    method: 'GET',
                });
                
                setWorkflow({ ...workflow, ...dataWorkspace });
                setNavigation({...navigation, ...dataWorkspace});
                files = dataWorkspace.files.map((file: any) => file.name);
            }
            for (const file of files) {
                const wfName = workflow.name + '.' + workflow.run;
                await requestAPI<any>(`workflows/${wfName}/workspace/${encodeURIComponent(file)}`, {
                    method: 'GET',
                });
            }
            
            Notification.success(
                selectedFiles.length === 1 ? `${selectedFiles[0]} downloaded` : `Downloaded ${files.length} files`,
                {
                    autoClose: 3000,
                }
            );
        } catch (e) {
            Notification.error(
                `Error downloading files`,
                {
                    autoClose: 3000,
                }
            );
        } finally {
            setDownloadLoading(false);
        }
    };

    const refreshWorkflows = (page: number = 1) => {
        setPage(page);
        setLoading(true);
    };

    const handleSelectFile = (file: string) => {
        selectedFiles.includes(file)
            ?
            setSelectedFiles(selectedFiles.filter(f => f !== file))
            :
            setSelectedFiles([...selectedFiles, file]);
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div className={`${classes.content} ${downloadLoading ? classes.transparent : ''}`}>
            <div className={classes.groupContainer}>
                <div className={classes.searchContainer}>
                <TextField
                    placeholder="Search"
                    value={query}
                    after={searchButton}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                    disabled={downloadLoading}
                />
                </div>

                <Button
                    className={`${classes.actionsButton}`}
                    onClick={() => download()}
                    disabled={downloadLoading}
                    title={selectedFiles.length > 0 ? `Download ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}` : 'Download all'}
                >
                    <div className={classes.buttonContent}>
                    <i className={`${classes.downloadIcon} material-symbols-outlined`}>download</i>
                    {isSidebarWide && 
                        <span>
                            {selectedFiles.length > 0 ? `Download ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}` : 'Download all'}
                        </span>}
                    </div>
                </Button>
            </div>
            <div className={classes.tableHeader}>
                <div className={classes.fileTitle}>File</div>
                <div className={classes.sizeTitle}>Size</div>
                {isSidebarWide && <div className={classes.lastModifiedTitle}>Last modified</div>}
            </div>
            <div className={classes.filesContainer}>
                {workflow?.files?.map((file, index) => (
                    <WorkflowWorkspaceFile
                        key={index}
                        file={file}
                        checked={selectedFiles.includes(file.name)}
                        onClick={() => handleSelectFile(file.name)}
                        isSidebarWide={isSidebarWide}
                        checkboxDisabled={downloadLoading}
                    />
                ))}
            </div>

            {navigation.total > WORKSPACE_PAGE_SIZE &&
                <Pagination currentPage={page} navigation={navigation} onPageChange={refreshWorkflows} pageSize={WORKSPACE_PAGE_SIZE} />
            }
        </div>
    );
}