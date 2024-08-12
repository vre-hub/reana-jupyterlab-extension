// /*
//   -*- coding: utf-8 -*-

//   This file is part of REANA.
//   Copyright (C) 2020, 2022, 2024 CERN.

//   REANA is free software; you can redistribute it and/or modify it
//   under the terms of the MIT License; see LICENSE file for more details.
// */

import { createUseStyles } from "react-jss";
import React from "react";
import { Button } from "../Button";
import { IReanaWorkflow } from "../../types";
import { statusMapping, NON_FINISHED_STATUSES } from "../../const";
import { getDurationString } from "../../utils";
import { UIStore } from "../../stores/UIStore";

const useStyles = createUseStyles({
    groupContainer: {
        display: "flex",
        padding: '8px 16px 4px 16px',
    },
    overviewPanel: {
        color: 'var(--raven)',
        fontSize: '16px',
        padding: '4px 18px 0 18px',

        '& .info': {
            display: 'flex',
            justifyContent: 'space-between',
            flexShrink: 0,

            '& .details-box': {
                display: 'flex',
                alignItems: 'baseline',
                maxWidth: '60%',
            },
        },

        '& .right-box': {
            padding: '0 2px 0 16px',
        },

        '& .name-container': { 
            whiteSpace: 'normal',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        },

        '& .name, & .status, & .status-icon, & .refresh': {
            fontWeight: 'bold',
        },

        '& .name': {
            fontSize: '1.3em',
        },

        '& .run, & .status': {
            fontSize: '1.2em'
        },

        '& .run': {
            padding: '0 0.8em'
        },

        '& .date': {
            display: 'block',
            whiteSpace: 'normal',
            wordWrap: 'break-word',
        },

        '& .status-icon': {
            marginRight: '3px',
            fontSize: '14px'
        },

        '& .finished': {
            color: 'var(--green)',
        },

        '& .running': {
            color: 'var(--blue)',
        },

        '& .failed': {
            color: 'var(--red)',
        },

        '& .created': {
            color: 'var(--violet)',
        },

        '& .stopped': {
            color: 'var(--yellow)',
        },

        '& .queued, & .pending': {
            color: 'var(--teal)',
        },
    },
    smallFont: {
        fontSize: '12px'
    },
    statusText : {
        fontSize: '16px',
    },
    iconSmall: {
        fontSize: '16px',
    },
    icon: {
        fontSize: '20px',
    },
    buttonIcon: {
        marginRight: '2px',
        fontSize: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsButton: {
        alignItems: 'center',
        width: '36px',
        cursor: 'pointer',
        '&:hover': {
            background: 'var(--jp-layout-color2)'
        }
    },
    refresh: {
        color: 'var(--gray)',
        cursor: 'pointer',
        position: 'relative',
        top: '3px',
    
        '&:hover': {
          color: 'var(--dark-gray)',
        }
    }
});
interface IOverviewProps {
    workflow: IReanaWorkflow;
    setWorkflow: (workflow: IReanaWorkflow | undefined) => void;
    refresh: (workflow: IReanaWorkflow) => void;
    refreshedAt: Date;
    isWide: boolean;
}

type MyProps = IOverviewProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowOverview: React.FC<MyProps> = ({
    workflow,
    setWorkflow,
    refresh,
    refreshedAt,
    isWide
}) => {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.groupContainer}>
                <Button
                    className={`${classes.actionsButton}`}
                    onClick={() => {setWorkflow(undefined); UIStore.update(s => {s.selectedWorkflow = null})}}
                >
                    <i className={`${classes.buttonIcon} material-symbols-outlined`}>
                        arrow_back
                    </i>
                </Button>
            </div>

            <div className={classes.overviewPanel}>
                <section className='info'>
                    <div className='details-box'>
                        <span className={`material-symbols-outlined status-icon ${workflow.status}`}>{statusMapping[workflow.status].icon}</span>
                        <div className="name-container">
                            <span className='name'>{workflow.name}</span>
                            <span className='run'>#{workflow.run}</span>

                            <div className={`date ${!isWide ? classes.smallFont : ''}`} title={workflow.finishedAt || workflow.startedAt || workflow.createdAt}>
                                {workflow.finishedAt
                                    ? `Finished: ${new Date(workflow.finishedAt).toLocaleString()}`
                                    : workflow.startedAt
                                        ? `Started: ${new Date(workflow.startedAt).toLocaleString()}`
                                        : `Created: ${new Date(workflow.createdAt).toLocaleString()}`}
                            </div>
                        </div>
                    </div>
                    <div className='details-box right-box'>
                            <div className={!isWide ? classes.smallFont : classes.statusText}>
                                <div>
                                    <span
                                        className={`status ${workflow.status}`}
                                    >
                                        {workflow.status}
                                    </span>{" "}
                                    {statusMapping[workflow.status].preposition} {getDurationString(workflow, refreshedAt)}
                                    {
                                        NON_FINISHED_STATUSES.includes(workflow.status) &&
                                        <span onClick={() => refresh(workflow)} className={classes.refresh}>
                                            <i className={`material-symbols-outlined ${isWide ? classes.icon : classes.iconSmall}`}>
                                                sync
                                            </i>
                                        </span>
                                    }
                                </div>
                                <div>
                                    step {workflow.finishedJobs}/{workflow.totalJobs}
                                </div>
                            </div>
                        </div>
                </section>
            </div>
        </div>
    );
}