export type ScanStartData = {
    id: string;
    status: string;
    notification: boolean;
    target: string;
    periodicity: string;
    userId: string;
}

export type ProbeStartData = {
    id: string;
    status: ProbeStatus;
    scanId: string;
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