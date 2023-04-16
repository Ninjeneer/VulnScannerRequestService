import { NoProbeResultsForReport, ReportDoesNotExist, ScanDoesNotExist } from "../../exceptions/exceptions";
import { ProbeResult } from "../../models/probe";
import { Report } from "../../models/report";
import { getProbeResultsByCurrentReportId, getProbeResultsByLastReportId } from "../../storage/probe.storage";
import { getScan } from "../../storage/scan.storage";
import { getResultsByIds } from "../../storage/mongo/mongoProbe.storage";
import * as reportMongoStorage from "../../storage/mongo/mongoReport.storage"
import { getParserByProbeName } from "./parser";
import { getReportById } from "../../storage/report.storage";



export const getMongoReportById = async (id: string): Promise<Report> => {
    return await reportMongoStorage.getReportById(id)
}

export const buildReport = async (reportId: string, isRebuild?: boolean): Promise<Report> => {
    const report = await getReportById(reportId)
    if (!report) {
        throw new ReportDoesNotExist(reportId);
    }

    const getProbesMethod = isRebuild ? getProbeResultsByLastReportId : getProbeResultsByCurrentReportId
    const probeResults = await getProbesMethod(reportId);
    if (!probeResults) {
        throw new NoProbeResultsForReport(reportId);
    }

    const scan = await getScan(report.scanId)
    if (!scan) {
        throw new ScanDoesNotExist(report.scanId)
    }

    // Get all the results from the database
    console.log(`[REPORT][${reportId}] Gathering all probe results for report ${reportId} in Mongo...`)
    const probesResults = await getResultsByIds(probeResults.map((probe) => probe.resultId))
    console.log(`[REPORT][${reportId}] Gathered ${probesResults.length} results`)

    // Parse all the results
    console.log(`[REPORT][${reportId}] Parsing results...`)
    const processedResults = await Promise.all(probesResults.map((result) => {
        const probeName = result.context.probeName;
        const parse = getParserByProbeName(probeName);
        return parse(result)
    }))
    console.log(`[REPORT][${reportId}] ${processedResults.length} results parsed`)


    let endedAt = Date.now()

    if (isRebuild) {
        const reportMongo = await getMongoReportById(report.reportId)
        endedAt = reportMongo.endedAt
    }

    // Build the report
    const finalReport: Report = {
        id: report.reportId,
        nbProbes: probesResults.length,
        target: scan.target,
        totalTime: calculateScanTime(probesResults),
        endedAt: endedAt,
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

export const rebuildReport = async (reportId: string) => {
    console.log(`[REPORT][REBUILD][${reportId}] Rebuilding report...`)
    const newReport = await buildReport(reportId, true)
    console.log(`[REPORT][REBUILD][${reportId}] Rebuilt successfully`)

    if (newReport) {
        console.log(`[REPORT][REBUILD][${reportId}] Saving to mongo...`)
        await reportMongoStorage.updateReport(newReport.id, newReport)
        console.log(`[REPORT][REBUILD][${reportId}] Saved to mongo`)
    }
}