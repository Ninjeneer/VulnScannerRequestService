import { CreateScanRequest } from "../requests/validators/scanRequest";
import { v4 as uuidv4 } from 'uuid';
import { saveScanStartData, saveProbesStartData, } from "../../storage/scan.storage";
import { ScanStatus, ScanRequestResponse } from "../../models/scan";
import { ProbeStatus } from "../../models/probe";
import { publishProbeRequest } from "../../storage/awsSqsQueue";


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
    await saveScanStartData({
        id: newScanId,
        status: ScanStatus.PENDING,
        notification: false,
        target: scanRequest.target,
        periodicity: scanRequest.periodicity,
        userId: scanRequest.user_id
    })
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