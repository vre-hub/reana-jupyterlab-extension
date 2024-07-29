export interface IReanaAuthCredentials {
    server: string;
    accessToken: string;
};

export interface IReanaWorkflowBase {
    id: string;
    name: string;
    run: string;
    status: string;
};

export interface IReanaJobLog {
    workflowUuid: string;
    jobName: string;
    computeBackend: string;
    backendJobId: string;
    dockerImg: string;
    cmd: string;
    status: string;
    logs: string;
    startedAt: string;
    finishedAt: string;
};

export interface IReanaWorkflowStatus extends IReanaWorkflowBase {
    createdAt: string;
    startedAt: string;
    finishedAt: string;
    stoppedAt: string;
    jobLogs: IReanaJobLog[];
    finishedJobs: number;
    totalJobs: number;
};

export interface IReanaWorkflowEngineLogs {
    engineLogs: string;
};

export interface IReanaWorkflowWorkspace {
    totalFiles: number;
    files: {
        name: string;
        lastModified: string;
        size: string;
    }[];
};

export interface IReanaWorkflowSpecification {
    inputs: {
        files: string[];
        parameters: { [key: string]: string };
    }
    outputs: string[];
    version: string;
    workflow: any;
};

export interface IReanaWorkflow extends
    IReanaWorkflowStatus, 
    IReanaWorkflowEngineLogs, 
    IReanaWorkflowWorkspace, 
    IReanaWorkflowSpecification {
};