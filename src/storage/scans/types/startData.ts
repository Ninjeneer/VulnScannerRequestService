export type ReportStartData = {
    id: string;
    status: string;
    notification: boolean;
}

export type ProbeStartData = {
    id: string;
    status: ProbeStatus;
    reportId: string;
}

export enum ReportStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}


export enum ProbeStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}