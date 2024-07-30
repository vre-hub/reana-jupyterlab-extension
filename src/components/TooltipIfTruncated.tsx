/*
  -*- coding: utf-8 -*-

  This file is part of REANA.
  Copyright (C) 2020, 2024 CERN.

  REANA is free software; you can redistribute it and/or modify it
  under the terms of the MIT License; see LICENSE file for more details.
*/

import React from "react";
import { createUseStyles } from "react-jss";


interface StyleProps {
    backgroundColor?: string;
}

const useStyles = createUseStyles({
    label : (props: StyleProps) => ({
        display: 'inline-block',
        padding: '2px 4px 2px 4px',
        backgroundColor: props.backgroundColor || 'var(--platinum)',
        marginRight: '4px',
        borderRadius: '4px',
        maxWidth: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    }),
    tooltipText: {
        marginLeft: '2px',
    },
    icon: {
        fontSize: '14px',
        verticalAlign: 'middle',
        fontWeight: 'bold',
        paddingBottom: '1px'
    },
});


interface ITooltipProps {
  tooltipText: string;
  tooltipIcon?: string;
  backgroundColor?: string;
}

type MyProps = React.HTMLAttributes<HTMLSpanElement> & ITooltipProps;

export const TooltipIfTruncated: React.FC<MyProps> = ({ tooltipText, tooltipIcon, backgroundColor }) => {
    const mouseEnter = (event: React.MouseEvent<HTMLSpanElement>) => {
        const element = event.target as HTMLElement;
        const overflows =
            element.offsetWidth < element.scrollWidth ||
            element.offsetHeight < element.scrollHeight;

        if (overflows && !element.getAttribute("title")) {
            element.setAttribute("title", tooltipText || element.innerText);
        }
    }

    // pass backgroundColor to classes
    const classes = useStyles({ backgroundColor });

    return (
        <span 
            className={classes.label}
            onMouseEnter={(event: React.MouseEvent<HTMLSpanElement>) => mouseEnter(event)}
        >
            {tooltipIcon && <i className={`${classes.icon} material-symbols-outlined`}>{tooltipIcon}</i>}
            <span className={classes.tooltipText}>{tooltipText}</span>
        </span>
    );

};