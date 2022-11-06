import IScanStorage from "./interfaces/scanStorageInterface";
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { ProbeStartData, ReportStartData } from "../../service/scan/types/startData";


export default class SupabaseStorage implements IScanStorage {
    private supabaseClient: SupabaseClient;
    
    constructor() {
        this.supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
    }

    async saveProbesStartData(probes: ProbeStartData[]) {
        await this.supabaseClient.from('probes').insert(probes)
    }

    async saveReportStartData(report: ReportStartData) {
        await this.supabaseClient.from('reports').insert(report)
    }
}