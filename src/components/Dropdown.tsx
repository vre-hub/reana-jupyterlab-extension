/*
 * Copyright European Organization for Nuclear Research (CERN)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Authors:
 * - Muhammad Aditya Hilmy, <mhilmy@hey.com>, 2020,
 * - Rubén Pérez Mercado, <ruben.perez.mercado@cern.ch>, 2024
 */

import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    container: {
        position: 'relative',
        display: 'inline-block'
    },
    dropdown: {
        cursor: 'pointer',
        width: '150px'
    },
    dropdownTitle: {
        fontWeight: '600',
        marginRight: '4px'
    },
});

interface IOption {
    title: string;
    value: any;
}

interface IDropdownProps {
    options: IOption[];
    value: any;
    onItemSelected?: { (value: any): void };
    optionWidth?: string;
}

type MyProps = React.HTMLAttributes<HTMLSpanElement> & IDropdownProps;

export const Dropdown: React.FC<MyProps> = ({
    options,
    value,
    onItemSelected,
    optionWidth,
    ...props
}) => {
    const classes = useStyles();

    const handleAddrTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onItemSelected && onItemSelected(value);
    }
    return (
        <div className={classes.container} {...props}>
            <span className={classes.dropdownTitle}>Step</span>
            <select 
                id="steps" 
                name="steplist"
                className={classes.dropdown}
                onChange={handleAddrTypeChange}
            >
                {options.map((option) => (
                    <option
                        value={option.value}
                    >
                        {option.title}
                    </option>
                ))}
            </select>
        </div>
    );
};