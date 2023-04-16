import { CreateScanRequest } from "../requests/validators/scanRequest";
import { v4 as uuidv4 } from 'uuid';
import { saveScanStartData, saveProbesStartData, updateScan, } from "../../storage/scan.storage";
import { ScanStatus, ScanRequestResponse } from "../../models/scan";
import { ProbeStatus } from "../../models/probe";
import { Scan } from '../../models/scan'
import { Report, SupabaseReport } from '../../models/report'
import { publishProbeRequest } from "../../storage/awsSqsQueue";
import { saveReport } from "../../storage/mongo/mongoReport.storage";
import { createReport } from "../../storage/report.storage";


export const requestScan = async (scanRequest: CreateScanRequest): Promise<ScanRequestResponse> => {
    const newScanId = uuidv4();
    console.log(`[REQUEST][${newScanId}] Received scan request ${newScanId}`)

    // Assing uids to probes
    const probes = scanRequest.probes.map((probe) => {
        return {
            ...probe,
            uid: uuidv4()
        }
    })

    // Save start data in supabase
    console.log(`[REQUEST][${newScanId}] Saving scan start data...`)
    const newScan = await saveScanStartData({
        id: newScanId,
        status: ScanStatus.PENDING,
        notification: false,
        target: scanRequest.target,
        periodicity: scanRequest.periodicity,
        userId: scanRequest.user_id
    })
    const currentReport = await setupScanNewReport(newScan)
    await updateScan(newScan.id, { currentReportId: currentReport.id})
    console.log(`[REQUEST][${newScanId}] Scan start data saved !`)

    console.log(`[REQUEST][${newScanId}] Saving probe start data...`)
    await saveProbesStartData(probes.map((probe) => ({
        id: probe.uid,
        status: ProbeStatus.PENDING,
        scanId: newScanId,
    })))
    console.log(`[REQUEST][${newScanId}] Probe start data saved !`)


    console.log(`[REQUEST][${newScanId}] Publishing request to Queue...`)
    await publishProbeRequest(probes.map((probe) => ({
        context: {
            id: probe.uid,
            name: probe.name,
            target: scanRequest.target
        },
        settings: probe.settings
    })));
    console.log(`[REQUEST][${newScanId}] Published request to Queue !`)

    return { scanId: newScanId };
}

const setupScanNewReport = async (scan: Scan): Promise<SupabaseReport> => {
    // TODO: make it contain all the logic for the scan update with a new report
    const report = await createReport({
        scanId: scan.id,
        userId: scan.userId
    })

    return report
}