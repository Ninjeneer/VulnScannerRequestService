import { SupabaseReport } from "../models/report"
import { ReportCreatePayload, ReportUpdatePayload } from "./dto/report.dto"
import supabaseClient from "./supabase"

export const createReport = async (data: ReportCreatePayload): Promise<SupabaseReport> => {
    return (await supabaseClient.from('reports').insert(data).select<string, SupabaseReport>().single()).data
}

export const updateReport = async (reportId: string, data: ReportUpdatePayload): Promise<SupabaseReport> => {
    return (await supabaseClient.from('reports').update(data).eq('id', reportId).select().single()).data
}

export const getReportById = async (reportId: string): Promise<SupabaseReport> => {
    return (await supabaseClient.from('reports').select<string, SupabaseReport>('*').eq('id', reportId).single()).data
}