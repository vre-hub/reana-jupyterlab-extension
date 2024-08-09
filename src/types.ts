export interface IReanaAuthCredentials {
    server: string;
    accessToken: string;
};

export interface IReanaWorkflowStatus {
    id: string;
    name: string;
    run: string;
    status: string;
    createdAt: string;
    startedAt?: string;
    finishedAt?: string;
    stoppedAt?: string;
    finishedJobs: number;
    totalJobs: number;
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

export interface IReanaWorkflowLogs {
    engineLogs: string;
    jobLogs: { [key: string]: IReanaJobLog };
};

export interface IReanaWorkflowWorkspaceFile {
    name: string;
    lastModified: string;
    size: string;
};

export interface IReanaWorkflowWorkspace {
    totalFiles: number;
    files: IReanaWorkflowWorkspaceFile[];
};

export interface IReanaWorkflowSpecification {
    parameters: any;
    specification: any;
};

export interface IReanaWorkflow extends
    IReanaWorkflowStatus, 
    Partial<IReanaWorkflowLogs>, 
    Partial<IReanaWorkflowWorkspace>, 
    Partial<IReanaWorkflowSpecification> {
};

export interface IReanaCreateParams {
    name: string;
    path: string;
    runtimeParams?: string;
};

export interface IFileEntry {
    name: string;
    type: 'file' | 'directory';
    path: string;
}