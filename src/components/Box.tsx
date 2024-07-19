import React from 'react';
import { createUseStyles } from 'react-jss';



const useStyles = createUseStyles({
    box: {
        display: 'flex',
        justifyContent: 'space-between',
        color: 'var(--raven)',
        border: '3px solid var(--sepia)',
        margin: '1rem 0',
        padding: '1em 1em',

        '&.wrap': {
            flexWrap: 'wrap'
        }
    }
})

interface BoxProps {
    children: React.ReactNode;
    className?: string;
    wrap?: boolean;
}

export const Box: React.FC<BoxProps> = ({ children, className = '', wrap = false }) => {
    const classes = useStyles();
    return (
        <div className={`${classes.box} ${className} ${wrap ? classes.box + ' wrap' : ''}`}>
            {children}
        </div>
    );
}
