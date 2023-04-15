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

export const getProbe = async (probeId: string): Promise<Probe> => {
    return (await supabaseClient.from('probes').select('*').eq('id', probeId).single()).data as Probe
}

export const getProbeResultsByScanId = async (scanId: string): Promise<SupabaseProbeResult[]> => {
    return (await supabaseClient
        .from('probes_results')
        .select('*, probes!inner(*, scans!inner(*))')
        .eq('probes.scans.id', scanId)
    ).data as SupabaseProbeResult[]
}

export const listenProbes = (onChange: (payload: RealtimePostgresChangesPayload<Probe>) => void) => {
    supabaseClient.channel('probes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'probes'}, onChange)
    .subscribe()
}
