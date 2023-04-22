import { getScan, getScansWithProbes, listenScans } from "../../storage/scan.storage";
import cron from 'node-cron'
import { restartScan } from "../requests/scanService";

const cronMapping: Record<string, cron.ScheduledTask> = {}

// Keep in memory scans periodicities to avoid restarting job on scan update
const periodicityMapping = {}

const init = async () => {
    console.log(`[JOBS][SCAN][INIT] Initializating scan jobs...`)
    const scans = await getScansWithProbes()
    for (const scan of scans) {
        if (scan.periodicity !== 'ONCE') {
            const scanTask = cron.schedule(scan.periodicity, () => restartScan(scan))
            cronMapping[scan.id] = scanTask
            cronMapping[scan.id].start()
        }
        periodicityMapping[scan.id] = scan.periodicity
    }
    console.log(`[JOBS][SCAN][INIT] Initialized ${Object.values(cronMapping).length} scans`)

    listenScans(async (change) => {
        if (change.eventType === 'UPDATE' || change.eventType === 'INSERT') {
            const isUpdate = change.eventType === 'UPDATE'
            const changeScan = change.new
            if (isUpdate && changeScan.periodicity === periodicityMapping[changeScan.id]) {
                // The periodicity has not been edited
                return
            }

            if (changeScan.periodicity === 'ONCE') {
                periodicityMapping[changeScan.id] = changeScan.periodicity
                if (isUpdate) {
                    cronMapping[changeScan.id].stop()
                    delete cronMapping[changeScan.id]
                }
                return
            }

            console.log(`[JOBS][SCAN][${change.eventType.toUpperCase()}] ${isUpdate ? 'Restarting' : 'Starting'} scan ${change.new.id} job...`)
            const scan = await getScan(change.new.id)
            if (isUpdate && cronMapping[scan.id]) {
                cronMapping[scan.id].stop()
            }
            cronMapping[scan.id] = cron.schedule(scan.periodicity, () => restartScan(scan))
            cronMapping[scan.id].start()
            periodicityMapping[scan.id] = scan.periodicity
            console.log({ old: periodicityMapping[scan.id], new: scan.periodicity })
            console.log(`[JOBS][SCAN][${change.eventType.toUpperCase()}] ${isUpdate ? 'Restarted' : 'Started'} scan ${change.new.id} job`)
        }
    })
}

export default init