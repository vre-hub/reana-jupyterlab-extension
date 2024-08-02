import React from 'react';

import { createUseStyles } from 'react-jss';
import { MAX_PAGES } from '../const';


const useStyles = createUseStyles({
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 16px 8px 16px',
        margin: '8px 0 8px 0',
    },
    page: {
        margin: '0 4px 0 4px',
        cursor: 'pointer',
        color: 'var(--raven)',
        '&:hover': {
            color: 'var(--sepia)',
        },
    },
    activePage: {
        margin: '0 4px 0 4px',
        cursor: 'pointer',
        color: 'var(--sepia)',
    },
    textPage: {
        fontSize: '1.25em',
    },
});

interface IPaginationProps {
    currentPage: number;
    navigation: {hasNext: boolean, hasPrev: boolean, total: number};
    onPageChange: (page: number) => void;
    pageSize: number;
}

export const Pagination: React.FC<IPaginationProps> = ({ currentPage, navigation, onPageChange, pageSize }) => {
    const classes = useStyles();

    const numberOfPages = Math.ceil(navigation.total / pageSize);

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };

    const renderPages = () => {
        const pages = [];

        const start = Math.max(1, Math.min(currentPage - 1, numberOfPages - MAX_PAGES + 1));
        const end = Math.min(numberOfPages, Math.max(currentPage + 1, MAX_PAGES));

        for (let i = start; i <= end; i++) {
            pages.push(
                <span
                    key={i}
                    className={`${i === currentPage ? classes.activePage : classes.page} ${classes.textPage}`}
                    onClick={i !== currentPage ? () => handlePageChange(i) : () => {}}
                >
                    {i}
                </span>
            );
        }
        return pages;
    };

    return (
        <div className={classes.pagination}>
            <span 
                className={`${classes.page} material-symbols-outlined`} 
                onClick={navigation.hasPrev ? () => handlePageChange(1) : () => {}}>
                first_page
            </span>
            <span 
                className={`${classes.page} material-symbols-outlined`} 
                onClick={navigation.hasPrev ? () => handlePageChange(currentPage - 1) : () => {}}>
                chevron_left
            </span>
            {renderPages()}
            <span 
                className={`${classes.page} material-symbols-outlined`}
                onClick={navigation.hasNext ? () => handlePageChange(currentPage + 1) : () => {}}>
                chevron_right
            </span>
            <span 
                className={`${classes.page} material-symbols-outlined`}
                onClick={navigation.hasNext ? () => handlePageChange(numberOfPages) : () => {}}>
                last_page
            </span>
        </div>
    );

};
