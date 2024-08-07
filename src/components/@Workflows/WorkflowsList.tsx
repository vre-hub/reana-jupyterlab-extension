import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { Loading } from '../Loading';

import { IReanaWorkflowStatus, IReanaWorkflow } from '../../types';
import { requestAPI } from '../../utils/ApiRequest';
import { Box } from '../Box';
import { PAGE_SIZE, statusMapping } from '../../const';
import { WorkflowFilters } from './WorkflowsFilters';
import { Pagination } from '../Pagination';
import { HorizontalHeading } from '../HorizontalHeading';

const useStyles = createUseStyles({
    container: {
        padding: '8px 16px 8px 16px'
    },

    label: {
        margin: '4px 0 4px 0'
    },
    textFieldContainer: {
        margin: '8px 0 8px 0'
    },
    workflowsContainer: {
        minHeight: '400px',
    },
    workflow: {
        '&:hover': {
            backgroundColor: 'lighten(var(--sepia), 3%)',
            borderColor: 'darken(var(--sepia), 10%)',
            cursor: 'pointer',
            color: 'var(--raven)',

            '& .actions': {
                visibility: 'visible'
            }
        },

        '&.deleted': {
            opacity: 0.5,
            color: 'var(--gray)',
        },

        '& .details-box': {
            display: 'flex',
            alignItems: 'baseline',
            marginRight: '1em',
            wordWrap: 'anywhere',

            '& .status-icon': {
                paddingRight: '20px',
            },

            '& .name': {
                fontSize: '1em',
            },

            '& .run': {
                paddingLeft: '0.5em',
                wordWrap: 'break-word',
            },

            '& .size': {
                color: 'var(--light-gray)',
                fontSize: '0.75em',
                marginRight: '0.75em',

                '&.highlight': {
                    color: 'var(--red)',
                }
            }
        },

        '& .status-box': {
            display: 'flex',
            alignItems: 'center',
        },

        '& .status': {
            display: 'flex',
            alignItems: 'center',
        },

        '& .name, & .status': {
            fontWeight: 'bold',
        },

        '& .status, & .run': {
            fontSize: '0.9em'
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

        '& .icon': {
            fontSize: '12px',
            marginRight: '3px',
            paddingTop: '2px',
        }
    }

});

interface IWorkflowsProps {
    workflows?: IReanaWorkflowStatus[];
    setWorkflows: { (val: IReanaWorkflowStatus[]): void };
    setSelectedWorkflow: { (val: IReanaWorkflow|undefined): void };
}

type MyProps = IWorkflowsProps & React.HTMLAttributes<HTMLDivElement>;


export const WorkflowList: React.FC<MyProps> = ({
    workflows = [],
    setWorkflows,
    setSelectedWorkflow,
}) => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(true);
    const [sortDir, setSortDir] = React.useState('desc');
    const [searchType, setSearchType] = React.useState('all');
    const [query, setQuery] = React.useState('');
    const [lastQuery, setLastQuery] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [navigation, setNavigation] = React.useState({hasNext: false, hasPrev: false, total: 0});

    useEffect(() => {
        if (loading) {
            const populateWorkflows = async () => {
                try {
                    const data = await requestAPI<any>(`workflows?&status=${searchType}&sort=${sortDir}&search=${query}&page=${page}`, {
                        method: 'GET',
                    });
                    setWorkflows('items' in data ? data.items : []);
                    setNavigation({hasNext: data.hasNext, hasPrev: data.hasPrev, total: data.total});
                } catch (error) {
                    console.error('Error setting variables:', error);
                } finally {
                    setLoading(false);
                }
            }
            populateWorkflows().catch(console.error);
        };
    }, [loading]);

    useEffect(() => {
        setPage(1);
        setLoading(true);
    }, [sortDir, searchType, lastQuery]);
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setLastQuery(query);
        }
    };

    const refreshWorkflows = (page: number = 1) => {
        setPage(page);
        setLoading(true);
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <HorizontalHeading title="Your workflows" />
            <WorkflowFilters
                refresh={refreshWorkflows}
                query={query}
                setQuery={setQuery}
                handleKeyDown={handleKeyDown}
                searchType={searchType}
                setSearchType={setSearchType}
                sortDir={sortDir}
                setSortDir={setSortDir}
            />
            <div className={classes.container}>
                {
                    workflows.length === 0 ?
                        <div>No workflows found</div> : (
                        <div className={classes.workflowsContainer}>
                        {

                        workflows.map((workflow) => {
                            const {
                                id,
                                name,
                                run,
                                status,
                            } = workflow;
                            return (
                                <div key={id} onClick={() => setSelectedWorkflow(workflow)}>
                                    <Box className={`${classes.workflow} ${status === 'deleted' ? classes.workflow + ' deleted' : ''}`}>
                                        <div className={classes.workflow + ' details-box'}>
                                            <span>
                                                <span className='name'>{name}</span>
                                                <span className='run'>#{run}</span>
                                            </span>
                                        </div>

                                        <div className={classes.workflow + ' status-box'}>
                                            <span
                                                className={`${classes.workflow + ' status'} ${status}`}
                                            >
                                                <span className='material-symbols-outlined icon'>{statusMapping[status].icon}</span>
                                                <span>{status}</span>
                                            </span>
                                        </div>
                                    </Box>
                                </div>
                            );
                        })}
                        </div>
                    )
                }
                {navigation.total > PAGE_SIZE &&
                    <Pagination currentPage={page} navigation={navigation} onPageChange={refreshWorkflows} pageSize={PAGE_SIZE}/>
                }
            </div>
        </div>

    );
};

