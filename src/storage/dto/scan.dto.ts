import { ScanStatus } from "../../models/scan";

export type ScanUpdatePayload = {
    status: ScanStatus,
    notification: boolean
    lastReportId?: string;
}