// /*
//   -*- coding: utf-8 -*-

//   This file is part of REANA.
//   Copyright (C) 2020, 2022 CERN.

//   REANA is free software; you can redistribute it and/or modify it
//   under the terms of the MIT License; see LICENSE file for more details.
// */

import PropTypes from "prop-types";
//import { WorkflowSorting } from "./WorkflowsSorting";
import { InlineDropdown } from "./InlineDropdown";
import { createUseStyles } from "react-jss";
import { WORKFLOW_STATUSES } from "../../const";
import React from "react";

const useStyles = createUseStyles({
    container: {
        padding: '0 16px 0 16px',
        fontSize: '1em'
    },
    dropdown: {
        color: 'var(--teal)',
        cursor: 'pointer',
        marginLeft: '4px'
      },
});
interface IFiltersProps {
    searchType: string;
    setSearchType: (searchType: string) => void;
    sortDir: string;
    setSortDir: (sortDir: string) => void;
}

type MyProps = IFiltersProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowFilters: React.FC<MyProps> = ({
    //   statusFilter,
    //   setStatusFilter,
    searchType,
    setSearchType,
    sortDir,
    setSortDir,
}) => {
    const classes = useStyles();

    const optionsStatus = [
        { title: "all", value: "all" },
        ...WORKFLOW_STATUSES.map((status) => ({
            title: status,
            value: status,
        })),
    ];

    const optionsSort = [
        {title: "newest first", value: "desc"},
        {title: "oldest first", value: "asc"}
    ]
    return (
        <div className={classes.container}>
            Status
            <InlineDropdown
                className={classes.dropdown}
                options={optionsStatus}
                value={searchType}
                onItemSelected={setSearchType}
                optionWidth="180px"
            />

            Sort by
            <InlineDropdown
                className={classes.dropdown}
                options={optionsSort}
                value={sortDir}
                onItemSelected={setSortDir}
                optionWidth="180px"
            />
        </div>
    );
}

WorkflowFilters.propTypes = {
    //   statusFilter: PropTypes.array.isRequired,
    //   setStatusFilter: PropTypes.func.isRequired,
    searchType: PropTypes.string.isRequired,
    setSearchType: PropTypes.func.isRequired,
    sortDir: PropTypes.string.isRequired,
    setSortDir: PropTypes.func.isRequired,
};