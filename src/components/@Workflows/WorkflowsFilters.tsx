// /*
//   -*- coding: utf-8 -*-

//   This file is part of REANA.
//   Copyright (C) 2020, 2022, 2024 CERN.

//   REANA is free software; you can redistribute it and/or modify it
//   under the terms of the MIT License; see LICENSE file for more details.
// */

import PropTypes from "prop-types";
//import { WorkflowSorting } from "./WorkflowsSorting";
import { InlineDropdown } from "../InlineDropdown";
import { createUseStyles } from "react-jss";
import { WORKFLOW_STATUSES } from "../../const";
import React from "react";
import { TextField } from "../TextField";
import { Button } from "../Button";

const useStyles = createUseStyles({
    groupContainer: {
        display: "flex",
        alignItems: "stretch",
        padding: '8px 16px 8px 16px'
    },
    searchContainer: {
        flexGrow: 1,
        marginRight: '2px',
        minWidth: 0
    },
    filterContainer: {
        padding: '0 16px 0 16px',
        fontSize: '1em'
    },
    dropdown: {
        color: 'var(--teal)',
        cursor: 'pointer',
        marginLeft: '4px'
    },
    searchButton: {
        alignItems: 'center',
        padding: '8px 8px 8px 4px',
        lineHeight: 0,
    },
    searchIcon: {
        fontSize: '18px',
    },
    refreshIcon: {
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
});
interface IFiltersProps {
    refresh: (page?: number) => void;
    query: string;
    setQuery: (query: string) => void;
    handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    searchType: string;
    setSearchType: (searchType: string) => void;
    sortDir: string;
    setSortDir: (sortDir: string) => void;
}

type MyProps = IFiltersProps & React.HTMLAttributes<HTMLDivElement>;

export const WorkflowFilters: React.FC<MyProps> = ({
    refresh,
    query,
    setQuery,
    handleKeyDown,
    searchType,
    setSearchType,
    sortDir,
    setSortDir,
}) => {
    const classes = useStyles();

    const searchButton = (
        <div className={classes.searchButton}>
            <i className={`${classes.searchIcon} material-symbols-outlined`}>search</i>
        </div>
    );

    const optionsStatus = [
        { title: "all", value: "all" },
        ...WORKFLOW_STATUSES.map((status) => ({
            title: status,
            value: status,
        })),
    ];

    const optionsSort = [
        { title: "newest first", value: "desc" },
        { title: "oldest first", value: "asc" }
    ];
    return (
        <div>
            <div className={classes.groupContainer}>
                <div className={classes.searchContainer}>
                <TextField
                    placeholder="Search"
                    value={query}
                    after={searchButton}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                />
                </div>

                <Button
                    className={`${classes.actionsButton}`}
                    onClick={() => refresh()}
                >
                    <i className={`${classes.refreshIcon} material-symbols-outlined`}>
                        sync
                    </i>
                </Button>
            </div>
            <div className={classes.filterContainer}>
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
        </div>
    );
}

WorkflowFilters.propTypes = {
    query: PropTypes.string.isRequired,
    setQuery: PropTypes.func.isRequired,
    handleKeyDown: PropTypes.func.isRequired,
    searchType: PropTypes.string.isRequired,
    setSearchType: PropTypes.func.isRequired,
    sortDir: PropTypes.string.isRequired,
    setSortDir: PropTypes.func.isRequired,
};