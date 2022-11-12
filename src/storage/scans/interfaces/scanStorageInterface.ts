import { ProbeStartData, ScanStartData } from "../../../service/scan/types/startData";

export default interface IScanStorage {
    saveReportStartData(report: ScanStartData);
    saveProbesStartData(probes: ProbeStartData[]);
}