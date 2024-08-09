import { createUseStyles } from 'react-jss';
import React, { useState } from 'react';
import { IReanaWorkflow } from '../../types';
import { Dropdown } from '../Dropdown';
import { TooltipIfTruncated } from '../TooltipIfTruncated';

import { getDurationString } from '../../utils';
import { statusMapping } from '../../const';


const useStyles = createUseStyles({
    content: {
        padding: '8px 16px 8px 16px'
    },
    dropdown: {
        color: 'var(--dark-gray)',
        margin: '4px 4px 0px 0px',
    },
    panel: {
        backgroundColor: 'var(--isabelline)',
        height: '42vh',
        overflow: 'auto',
        width: '100%'
    },
    tooltipGroup: {
        margin: '8px 0px 8px 0px',
    },
    stepDuration: {
        color: 'var(--dark-gray)',
        fontSize: '14px',
    },
    message: {
        padding: '16px',
        textAlign: 'center'
    }
});

interface IWorkflowLogsProps {
    workflow: IReanaWorkflow;
    refreshedAt: Date;
}

type MyProps = IWorkflowLogsProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowJobLogs: React.FC<MyProps> = ({ workflow, refreshedAt }) => {
    const classes = useStyles();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const stepsData = workflow?.jobLogs !== undefined ? Object.values(workflow.jobLogs) : [];

    if (stepsData.length === 0) {
        return (
            <div className={classes.content}>
                <p className={classes.message}>No logs available</p>
            </div>
        );
    }

    return (
        <div className={classes.content}>
            <Dropdown
                className={classes.dropdown}
                options={stepsData.map((step, index) => ({ title: step.jobName, value: index }))}
                value={selectedIndex}
                onItemSelected={setSelectedIndex}
                optionWidth='200px'
            />

            <div className={classes.tooltipGroup}>
                <TooltipIfTruncated 
                    tooltipText={ 
                        statusMapping[stepsData[selectedIndex].status]?.preposition ? 
                        `${stepsData[selectedIndex].status} ${statusMapping[stepsData[selectedIndex].status].preposition} ${getDurationString(stepsData[selectedIndex], refreshedAt)}` :
                        stepsData[selectedIndex].status
                    }
                    tooltipIcon='timer'
                    backgroundColor={statusMapping[stepsData[selectedIndex].status].color} 
                />
                <TooltipIfTruncated tooltipText={stepsData[selectedIndex].computeBackend} tooltipIcon='cloud' />
                <TooltipIfTruncated tooltipText={stepsData[selectedIndex].dockerImg} tooltipIcon='deployed_code' />
                <TooltipIfTruncated tooltipText={stepsData[selectedIndex].cmd} tooltipIcon='attach_money' />
            </div>
            <pre className={classes.panel}>{stepsData[selectedIndex].logs}</pre>
        </div>
    );
}