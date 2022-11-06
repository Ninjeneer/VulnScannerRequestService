import { CreateScanRequest } from "../../server/requests/scanRequest";
import { ScanRequestResponse } from "../types/scanRequest";

export default interface IScanService {
    requestScan(scanRequest: CreateScanRequest): Promise<ScanRequestResponse>;
}