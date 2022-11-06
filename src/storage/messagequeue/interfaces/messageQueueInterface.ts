import { ProbeRequest } from "../types/probeRequest";

export default interface IMessageQueue {
    publishProbeRequest(probeRequests: ProbeRequest[]): Promise<boolean>;
}