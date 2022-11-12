export type ScanStartData = {
    id: string;
    status: string;
    notification: boolean;
    target: string;
}

export type ProbeStartData = {
    id: string;
    status: ProbeStatus;
    reportId: string;
}

export enum ScanStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}

export enum ProbeStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}