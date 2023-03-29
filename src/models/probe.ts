export type ProbeStartData = {
    id: string;
    status: ProbeStatus;
    scanId: string;
}

export enum ProbeStatus {
    PENDING = 'PENDING',
    RUNNING = 'RUNNING',
    FINISHED = 'FINISHED',
}

export type ProbeRequest = {
    context: {
        id: string;
        name: string;
        target: string;
    },
    [key: string]: any;
}

export type SupabaseProbeResult = {
    id: string;
    probeId: string;
    resultId: string;
}

export type ProbeResult = {
    context: {
        timestampStart: number;
        timestampStop: number;
        probeUid: string;
        probeName: string;
    };
    result: any;
}