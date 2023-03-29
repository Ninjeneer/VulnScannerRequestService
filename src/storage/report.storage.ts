import { SupabaseReport } from "../models/report"
import { ReportCreatePayload } from "./dto/report.dto"
import supabaseClient from "./supabase"

export const createReport = async (data: ReportCreatePayload): Promise<SupabaseReport> => {
    return (await supabaseClient.from('reports').insert(data).select<string, SupabaseReport>().single()).data
}
