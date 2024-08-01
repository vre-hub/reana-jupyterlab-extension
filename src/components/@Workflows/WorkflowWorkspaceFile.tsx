/*
 * Copyright European Organization for Nuclear Research (CERN)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Authors:
 * - Muhammad Aditya Hilmy, <mhilmy@hey.com>, 2020
 */

import React from 'react';
import { createUseStyles } from 'react-jss';
import { IReanaWorkflowWorkspaceFile } from '../../types';

const useStyles = createUseStyles({
    listItemContainer: {
        borderBottom: '1px solid var(--jp-border-color2)',
        overflow: 'hidden',
        boxSizing: 'border-box'
    },
    listItem: {
        display: 'flex',
        flexDirection: 'row',
        fontSize: '9pt',
        alignItems: 'center',
        padding: '8px 16px 8px 16px',
        cursor: 'pointer'
    },
    listItemCollapsed: {
        extend: 'listItem',
        '&:hover': {
            backgroundColor: 'var(--jp-layout-color2)'
        }
    },
    listItemExpanded: {
        extend: 'listItem',
        backgroundColor: 'var(--jp-layout-color2)'
    },
    textContainer: {
        flex: 2,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    },
    iconContainer: {
        lineHeight: 0,
        marginRight: '8px'
    },
    icon: {
        fontSize: '16px',
        verticalAlign: 'middle'
    },
    fileIcon: {
        extend: 'icon',
        color: '#66B100'
    },
    containerIcon: {
        extend: 'icon',
        color: '#5DC0FD'
    },
    datasetIcon: {
        extend: 'icon',
        color: '#FFB100'
    },
    sizeContainer: {
        padding: '0 8px',
        color: 'var(--jp-ui-font-color2)',
        flex: 1,
    },
    lastModifiedContainer: {
        flex: 1,
    },
    listFilesIcon: {
        extend: 'icon',
        color: '#2196F3',
        cursor: 'pointer'
    }
});

export interface IWorkspaceFileProps {
    key: number;
    file: IReanaWorkflowWorkspaceFile;
    onClick: () => void;
    style?: any;
}

export const WorkflowWorkspaceFile: React.FC<IWorkspaceFileProps> = ({
    key,
    file,
    onClick,
    style
}) => {
    const classes = useStyles();

    return (
        <div className={classes.listItemContainer} style={style}>
            <div
                className={classes.listItemCollapsed}
                onClick={onClick}
                key={key}
            >
                <div className={classes.iconContainer}>
                    <i className='material-symbols-outlined'>draft</i>
                </div>
                <div className={classes.textContainer}>{file.name}</div>
                <div className={classes.sizeContainer}>{file.size}</div>
                <div className={classes.lastModifiedContainer}>{new Date(file.lastModified).toLocaleString()}</div>
            </div>
        </div>
    );
};