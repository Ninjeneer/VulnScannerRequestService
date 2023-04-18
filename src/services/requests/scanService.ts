import { CreateScanRequest, UpdateScanRequest } from "../requests/validators/scanRequest";
import { v4 as uuidv4 } from 'uuid';
import * as scanStorage from "../../storage/scan.storage";
import { ScanStatus, ScanRequestResponse } from "../../models/scan";
import { ProbeStatus } from "../../models/probe";
import { Scan } from '../../models/scan'
import { Report, SupabaseReport } from '../../models/report'
import { publishProbeRequest } from "../../storage/awsSqsQueue";
import { saveReport } from "../../storage/mongo/mongoReport.storage";
import { createReport } from "../../storage/report.storage";
import { ScanDoesNotExist } from "../../exceptions/exceptions";
import { deleteProbes } from "../../storage/probe.storage";


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
    const newScan = await scanStorage.saveScanStartData({
        id: newScanId,
        status: ScanStatus.PENDING,
        notification: false,
        target: scanRequest.target,
        periodicity: scanRequest.periodicity,
        userId: scanRequest.user_id
    })
    const currentReport = await setupScanNewReport(newScan)
    await scanStorage.updateScan(newScan.id, { currentReportId: currentReport.id})
    console.log(`[REQUEST][${newScanId}] Scan start data saved !`)

    console.log(`[REQUEST][${newScanId}] Saving probe start data...`)
    await scanStorage.saveProbesStartData(probes.map((probe) => ({
        id: probe.uid,
        status: ProbeStatus.PENDING,
        scanId: newScanId,
        name: probe.name
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
        userId: scan.userId,
        target: scan.target
    })

    return report
}

export const updateScan = async (scanId: string, scanWithProbes: UpdateScanRequest): Promise<Scan> => {
    console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Update started`)
    const scan = await scanStorage.getScan(scanId)
    if (!scan) {
        throw new ScanDoesNotExist(scanId)
    }

    const probesToRemove = scan.probes?.filter((probe) => !scanWithProbes.probes?.find((newProbe) => newProbe.name === probe.name)) || []
    if (probesToRemove.length > 0) {
        console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Removing ${probesToRemove.length} probes...`)
        if (await deleteProbes(probesToRemove.map((probe) => probe.id))) {
            console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Removed ${probesToRemove.length} probes successfully`)
        } else {
            console.log(`[REQUEST][SCAN][UPDATE][${scanId}] One or more probes failed to be deleted`)
        }
    }

    const newProbes = scanWithProbes.probes?.filter((probe) => !scan.probes?.find((newProbe) => newProbe.name === probe.name)) || []
    if (newProbes.length > 0) {
        console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Creating ${newProbes.length} new probes...`)
        await scanStorage.saveProbesStartData(newProbes.map((probe) => ({
            id: uuidv4(),
            status: ProbeStatus.PENDING,
            scanId,
            name: probe.name
        })))
        console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Probes created successfully`)
    }


    const originalKeys = Object.keys(scan)
    const keysToIgnore = ['probes']
    const payload = {}
    for (const updateKey of Object.keys(scanWithProbes)) {
        if (originalKeys.includes(updateKey) && !keysToIgnore.includes(updateKey)) {
            payload[updateKey] = scanWithProbes[updateKey]
        }
    }
    console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Updating scan...`)
    const updatedScan = await scanStorage.updateScan(scanId, payload)
    console.log(`[REQUEST][SCAN][UPDATE][${scanId}] Scan updated`)
    return updatedScan
}