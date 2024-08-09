import React, { useState, useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { IFileEntry } from '../types';
import { requestAPI } from '../utils/ApiRequest';
import { Loading } from './Loading';

const useStyles = createUseStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100%',
        maxHeight: '25vh', // Set the max height
        overflowY: 'auto',  // Allow scrolling if content exceeds max height
        border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '10px',
        boxSizing: 'border-box',
    },
    item: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '5px',
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: '#f0f0f0',
        },
    },
    fileDetails: {
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',  // Ensure text overflow is handled properly
    },
    fileName: {
        marginLeft: '10px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    icon: {
        width: '16px',
        height: '16px',
        marginRight: '5px',
        fontSize: '18px',
    },
    buttonContainer: {
        marginTop: '10px',
        textAlign: 'center',
    },
});

interface FileBrowserProps {
    onSelectFile: (filePath: string) => void;
}

export const FileBrowser: React.FC<FileBrowserProps> = ({ onSelectFile }) => {
    const classes = useStyles();
    const [entries, setEntries] = useState<IFileEntry[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadFiles = async () => {
            setLoading(true);
            setError('');
            try {
                const dataFiles = await requestAPI<any>(`files?path=${encodeURIComponent(currentPath)}`);
                setEntries(dataFiles.entries || []);

            } catch (error) {
                setError('Error fetching file entries.');
                console.error('Error fetching file entries:', error);
            } finally {
                setLoading(false);
            }
        };

        loadFiles();
    }, [currentPath]);

    const handleClick = (entry: IFileEntry) => {
        if (entry.type === 'directory') {
            setCurrentPath(entry.path);
        } else {
            onSelectFile(entry.path);
        }
    };

    const parentDirectory = () => {
        if (currentPath === '') return;
        const newPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        setCurrentPath(newPath);
    }

    return (
        <div>
            <div className={classes.container}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {
                    loading
                        ?
                        <Loading />
                        :
                        <>
                            {currentPath !== '' &&
                                <div>
                                    <div key={'parent-folder'} className={classes.item} onClick={parentDirectory}>
                                        <div className={classes.fileDetails}>
                                            <span className={`material-symbols-outlined ${classes.icon}`}>
                                                folder
                                            </span>
                                            <span className={classes.fileName}>..</span>
                                        </div>
                                    </div>
                                </div>

                            }
                            {entries.map((entry) => (
                                <div>
                                    <div key={entry.path} className={classes.item} onClick={() => handleClick(entry)}>
                                        <div className={classes.fileDetails}>
                                            <span className={`material-symbols-outlined ${classes.icon}`}>
                                                {entry.type === 'directory' ? 'folder' : 'draft'}
                                            </span>
                                            <span className={classes.fileName}>{entry.name}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                }
            </div>
        </div>
    );
};