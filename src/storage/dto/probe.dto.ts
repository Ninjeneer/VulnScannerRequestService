import { ProbeStatus } from "../../models/probe";

export type ProbeUpdatePayload = {
    status: ProbeStatus;
}

export type ProbeResultPayload = {
    probeId: string;
    resultId: string;
    reportId: string;
}