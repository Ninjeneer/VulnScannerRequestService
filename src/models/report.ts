import { ProbeResult } from "./probe";

export type Report = {
    nbProbes: number;
    totalTime: number;
    target: string;
    endedAt: number;
    results: ProbeResult[];
}

export type SupabaseReport = {
    id: string;
    scanId: string;
    userId: string;
    reportId: string;
}