import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import { SupabaseProbeResult, Probe } from "../models/probe"
import { ProbeUpdatePayload, ProbeResultPayload } from "./dto/probe.dto"
import supabaseClient from "./supabase"

export const updateProbe = async (id: string, data: ProbeUpdatePayload): Promise<void> => {
    await supabaseClient.from('probes').update({ status: data.status }).eq('id', id)
}

export const createProbeResult = async (data: ProbeResultPayload): Promise<SupabaseProbeResult> => {
    return (await supabaseClient.from('probes_results').insert(data).select().single()).data
}

export const deleteProbes = async (ids: string[]) => {
    const res = await supabaseClient.from('probes').delete({ count: 'exact' }).in('id', ids)
    return res.count === ids.length
}

export const deleteProbe = async (id: string) => {
    return (await supabaseClient.from('probes').delete().eq('id', id)).count === 1
}

export const getProbe = async (probeId: string): Promise<Probe> => {
    return (await supabaseClient.from('probes').select('*').eq('id', probeId).single()).data as Probe
}

export const getProbeResultsByCurrentReportId = async (reportId: string): Promise<SupabaseProbeResult[]> => {
    return (await supabaseClient
        .from('probes_results')
        .select('*, probes!inner(*, scans!inner(*))')
        .eq('probes.scans.currentReportId', reportId)
    ).data as SupabaseProbeResult[]
}

export const getProbeResultsByLastReportId = async (reportId: string): Promise<SupabaseProbeResult[]> => {
    return (await supabaseClient
        .from('probes_results')
        .select('*, probes!inner(*, scans!inner(*))')
        .eq('probes.scans.lastReportId', reportId)
    ).data as SupabaseProbeResult[]
}

export const listenProbes = (onChange: (payload: RealtimePostgresChangesPayload<Probe>) => void) => {
    supabaseClient.channel('probes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'probes'}, onChange)
    .subscribe()
}
