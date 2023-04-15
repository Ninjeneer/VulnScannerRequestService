import { Probe } from "./probe";

export type ScanStartData = {
    id: string;
    status: ScanStatus;
    notification: boolean;
    target: string;
    periodicity: string;
    userId: string;
}

export enum ScanStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}

export type ScanRequestResponse = {
    scanId: string;
}

export type ScanWithProbes = ScanStartData & {
    probes: Probe[];
}