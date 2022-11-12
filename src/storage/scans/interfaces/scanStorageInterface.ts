import { ProbeStartData, ScanStartData } from "../../../service/scan/types/startData";

export default interface IScanStorage {
    saveScanStartData(report: ScanStartData): Promise<{ reportId: string }>;
    saveProbesStartData(probes: ProbeStartData[]);
}