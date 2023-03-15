import IScanStorage from "./interfaces/scanStorageInterface";
import { ProbeStartData, ScanStartData } from "../../service/scan/types/startData";
import supabaseClient from '../supabase'

export default class SupabaseStorage implements IScanStorage {

    async saveProbesStartData(probes: ProbeStartData[]) {
        await supabaseClient.from('probes').insert(probes)
    }

    async saveScanStartData(scan: ScanStartData): Promise<{ scanId: string }> {
        await supabaseClient.from('scans').insert(scan)
        return { scanId: scan.id }
    }
}