import { UserStats } from "../../models/stats"
import { getReportsByUserId } from "../../storage/report.storage"
import { getScansWithProbesByUserId } from "../../storage/scan.storage"
import { isDefined } from "../../utils"

export const getStatsForUser = async (userId: string): Promise<UserStats> => {
    const [scans, reports] = await Promise.all([
        getScansWithProbesByUserId(userId),
        getReportsByUserId(userId)
    ])

    const nbTotalProbes = scans.reduce((sum, scan) => sum + scan.probes?.length, 0)
    const avgProbesPerScan = nbTotalProbes / scans.length

    return {
        nbScans: scans.length,
        nbReports: reports?.filter((report) => isDefined(report.reportId)).length,
        nbTotalProbes,
        avgProbesPerScan,
        nbVuln: 0
    }
}