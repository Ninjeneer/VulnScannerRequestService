import { ProbeDoesNotExist, ScanDoesNotExist } from "../../exceptions/exceptions"
import { ProbeStatus } from "../../models/probe"
import { ScanStatus, ScanWithProbes } from "../../models/scan"
import { deleteMessageFromQueue, deleteMessagesFromQueue, listenResultsQueue } from "../../storage/awsSqsQueue"
import { saveReport } from "../../storage/mongo/mongoReport.storage"
import { getProbe, updateProbe, createProbeResult } from "../../storage/probe.storage"
import { createReport } from "../../storage/report.storage"
import { getScan, updateScan } from "../../storage/scan.storage"
import { buildReport } from "./reportService"

const onProbeResult = async (probeId: string, resultId: string): Promise<boolean> => {
    console.log(`[RESULT][${probeId}] Received result of probe ${probeId} with resultId ${resultId}`)
    const probe = await getProbe(probeId);
    if (!probe) {
        throw new ProbeDoesNotExist();
    }
    await updateProbe(probeId, { status: ProbeStatus.FINISHED });
    await createProbeResult({ probeId, resultId })

    const scan = await getScan(probe.scanId);
    if (!scan) {
        throw new ScanDoesNotExist(probe.scanId);
    }
    if (isScanFinished(scan)) {
        console.log(`[RESULT][${scan.id}] Scan ${scan.id} is finished`)

        console.log(`[REPORT][${scan.id}] Building report`)
        const report = await buildReport(scan.id);
        console.log(`[REPORT][${scan.id}] Saving report...`)
        const reportId = await saveReport(report)
        console.log(`[REPORT][MONGO][${scan.id}] Report ${reportId} saved !`)

        console.log(`[REPORT][${scan.id}] Creating report entry into Supabase...`)
        const savedReport = await createReport({ reportId, scanId: scan.id, userId: scan.userId })
        await updateScan(scan.id, {
            status: ScanStatus.FINISHED,
            notification: true,
            lastReportId: savedReport.id
        })
        console.log(`[REPORT][${scan.id}] Created report !`)
    }
    return true
}

const isScanFinished = (scan: ScanWithProbes): boolean => {
    return scan.probes.every((probe) => probe.status === ProbeStatus.FINISHED);
}

export const initResponsesQueue = () => {
    listenResultsQueue(async (resultMessage, rawMessage) => {
        try {
            if (await onProbeResult(resultMessage.probeId, resultMessage.objectId)) {
                await deleteMessageFromQueue(rawMessage)
                console.log(`[RESULT] Removed result of probe ${resultMessage.probeId} from queue`)
            }
        } catch (e) {
            console.error('Failed to handle probe result !', e.message)
        }
    })
}
