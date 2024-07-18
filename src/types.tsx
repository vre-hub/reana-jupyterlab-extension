export interface IReanaAuthCredentials {
    server: string;
    accessToken: string;
};

export interface IReanaWorkflow {
    created: string;
    id: string;
    name: string;
    size: {
        human_readable: string;
        raw: number;
    };
    status: string;
    user: string;
};