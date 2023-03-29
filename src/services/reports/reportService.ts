import { ScanDoesNotExist } from "../../exceptions/exceptions";
import { ProbeResult } from "../../models/probe";
import { Report } from "../../models/report";
import { getProbeResultsByScanId } from "../../storage/probe.storage";
import { getScan } from "../../storage/scan.storage";
import { getResultsByIds } from "../../storage/mongo/mongoProbe.storage";
import * as reportMongoStorage from "../../storage/mongo/mongoReport.storage"
import { getParserByProbeName } from "./parser";



export const getReportById = async (id: string): Promise<Report> => {
    return await reportMongoStorage.getReportById(id)
}

export const buildReport = async (scanId: string): Promise<Report> => {
    const scan = await getScan(scanId)
    if (!scan) {
        throw new ScanDoesNotExist();
    }

    const probeResults = await getProbeResultsByScanId(scanId);
    if (!probeResults) {
        throw new ScanDoesNotExist();
    }

    // Get all the results from the database
    console.log(`[REPORT][${scanId}] Gathering all probe results for scan ${scanId}`)
    const probesResults = await getResultsByIds(probeResults.map((probe) => probe.resultId))
    console.log(`[REPORT][${scanId}] Gathered ${probesResults.length} results`)

    // Parse all the results
    console.log(`[REPORT][${scanId}] Parsing results...`)
    const processedResults = await Promise.all(probesResults.map((result) => {
        const probeName = result.context.probeName;
        const parse = getParserByProbeName(probeName);
        return parse(result)
    }))
    console.log(`[REPORT][${scanId}] ${processedResults.length} results parsed`)

    // Build the report
    const finalReport: Report = {
        nbProbes: scan.probes.length,
        target: scan.target,
        totalTime: calculateScanTime(probesResults),
        endedAt: Date.now(),
        results: processedResults
    }

    return finalReport
}

const calculateScanTime = (results: ProbeResult[]): number => {
    const times = results.map((result) => ({
        start: result.context.timestampStart,
        stop: result.context.timestampStop
    }))

    const ascSortedStarts = [...times].sort((a, b) => a.start - b.start)
    const descSortedStops = [...times].sort((a, b) => a.stop - b.stop)
    const firstStart = ascSortedStarts[0].start;
    const lastStop = descSortedStops[descSortedStops.length - 1].stop;

    return lastStop - firstStart;
}
