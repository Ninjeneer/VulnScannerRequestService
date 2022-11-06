import { ProbeStartData, ReportStartData } from "../types/startData";

export default interface IScanStorage {
    saveReportStartData(report: ReportStartData);
    saveProbesStartData(probes: ProbeStartData[]);
}