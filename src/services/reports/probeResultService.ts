import { ProbeDoesNotExist, ScanDoesNotExist } from "../../exceptions/exceptions"
import { Probe, ProbeStatus } from "../../models/probe"
import { ScanStatus, ScanWithProbes } from "../../models/scan"
import { deleteMessageFromQueue, deleteMessagesFromQueue, listenResultsQueue } from "../../storage/awsSqsQueue"
import { saveReport } from "../../storage/mongo/mongoReport.storage"
import { getProbe, updateProbe, createProbeResult, listenProbes } from "../../storage/probe.storage"
import { createReport, updateReport } from "../../storage/report.storage"
import { getScan, updateScan } from "../../storage/scan.storage"
import { buildReport } from "./reportService"

const onProbeStart = async (probe: Probe) => {
    if (!probe) {
        console.error('[REPORT][PROBE START] Probe is missing')
        return
    }

    const scan = await getScan(probe.scanId)
    if (!scan) {
        console.error(`[REPORT][PROBE START] Scan ${probe.scanId} of probe ${probe.id} does not exist`)
        return
    }

    await updateScan(scan.id, { status: ScanStatus.RUNNING })
}

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
        const report = await buildReport(scan.currentReportId);
        console.log(`[REPORT][${scan.id}] Saving report...`)
        const reportId = await saveReport(report)
        console.log(`[REPORT][MONGO][${scan.id}] Report ${reportId} saved !`)

        console.log(`[REPORT][${scan.id}] Creating report entry into Supabase...`)
        const savedReport = await updateReport(scan.currentReportId, { reportId })
        await updateScan(scan.id, {
            status: ScanStatus.FINISHED,
            notification: true,
            lastReportId: savedReport.id,
            currentReportId: null
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
            console.error('Failed to handle probe result !', e.stack)
        }
    })
}

export const initProbeListening = () => {
    console.log('[REPORT][PROBES] Listening to realtime changes')
    listenProbes((change) => {
        if (change.eventType === 'UPDATE' && change.new.status === ProbeStatus.RUNNING) {
            // No 100% sure the probe is starting
            onProbeStart(change.new)
        }
    })
}

initProbeListening()
