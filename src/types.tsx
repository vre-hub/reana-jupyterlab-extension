export interface IReanaAuthCredentials {
    server: string;
    accessToken: string;
};

export interface IReanaWorkflow {
    id: string;
    name: string;
    run: string;
    createdAt: string;
    startedAt: string;
    finishedAt: string;
    stoppedAt: string;
    status: string;
};