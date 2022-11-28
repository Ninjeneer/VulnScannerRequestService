import { ProbeStartData, ScanStartData } from "../../../service/scan/types/startData";

export default interface IScanStorage {
    saveScanStartData(scan: ScanStartData): Promise<{ scanId: string }>;
    saveProbesStartData(probes: ProbeStartData[]);
}