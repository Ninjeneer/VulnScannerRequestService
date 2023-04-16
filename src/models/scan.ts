import { Probe } from "./probe";

export type Scan = {
    id: string;
    status: ScanStatus;
    notification: boolean;
    target: string;
    periodicity: string;
    userId: string;
    currentReportId?: string
}

export enum ScanStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}

export type ScanRequestResponse = {
    scanId: string;
}

export type ScanWithProbes = Scan & {
    probes: Probe[];
}