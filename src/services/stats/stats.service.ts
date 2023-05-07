import { UserStats } from "../../models/stats"
import { getReportsById } from "../../storage/mongo/mongoReport.storage"
import { getReportsByUserId } from "../../storage/report.storage"
import { getScanByUserID } from "../../storage/scan.storage"
import { isDefined } from "../../utils"

export const getStatsForUser = async (userId: string): Promise<UserStats> => {
    const [scans, reports] = await Promise.all([
        getScanByUserID(userId),
        getReportsByUserId(userId)
    ])

    const reportsResults = await getReportsById(reports.map((report) => report.reportId))
    const nbTotalProbes = reportsResults.reduce((acc, report) => acc + report.nbProbes, 0)
    const avgProbesPerScan = nbTotalProbes / scans.length

    return {
        nbScans: scans.length,
        nbReports: reports?.filter((report) => isDefined(report.reportId)).length,
        nbTotalProbes,
        avgProbesPerScan,
        nbVuln: 0
    }
}