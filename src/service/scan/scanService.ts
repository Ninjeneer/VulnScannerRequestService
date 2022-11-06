import { CreateScanRequest } from "../server/requests/scanRequest";
import IScanService from "./interfaces/scanServiceInterface";
import { ScanRequestResponse } from "./types/scanRequest";
import { v4 as uuidv4 } from 'uuid';

export default class ScanService implements IScanService {
    constructor() {}

    requestScan(scanRequest: CreateScanRequest): Promise<ScanRequestResponse> {
        const newReportId = uuidv4();

        // Assing uids to probes
        const probes = scanRequest.probes.map((probe) => {
            return {
                ...probe,
                uid: uuidv4()
            }
        })

        return Promise.resolve({
            reportId: newReportId,
        })
    }

}