import { ProbeStartData, ReportStartData } from "../../../service/scan/types/startData";

export default interface IScanStorage {
    saveReportStartData(report: ReportStartData);
    saveProbesStartData(probes: ProbeStartData[]);
}