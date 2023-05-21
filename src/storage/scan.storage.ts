import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { Probe } from '../models/probe'
import { Scan, ScanWithProbes } from '../models/scan'
import { ScanUpdatePayload } from './dto/scan.dto'
import supabaseClient from './supabase'


export const saveProbesStartData = async (probes: Probe[]) => {
    await supabaseClient.from('probes').insert(probes)
}

export const saveScanStartData = async (scan: Scan): Promise<Scan> => {
    const newScan = (await supabaseClient.from('scans').insert(scan).select()).data
    return scan
}

export const getScan = async (scanId: string): Promise<ScanWithProbes> => {
    return (await supabaseClient.from('scans').select('*, probes(*)').eq('id', scanId).single()).data as ScanWithProbes
}

export const getScansWithProbes = async (): Promise<ScanWithProbes[]> => {
    return (await supabaseClient.from('scans').select('*, probes(*)')).data
}

export const updateScan = async (id: string, data: Partial<ScanUpdatePayload>): Promise<Scan> => {
    const res = await supabaseClient.from('scans').update(data).eq('id', id).select().single()
    if (res.error) {
        console.log(res.error)
    }
    return res.data
}

export const listenScans = (onChange: (payload: RealtimePostgresChangesPayload<Scan>) => void) => {
    supabaseClient.channel('scans')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scans' }, onChange)
        .subscribe()
}

export const getScansWithProbesByUserId = async (userId: string): Promise<ScanWithProbes[]> => {
    const res = await supabaseClient.from('scans').select('*, probes(*)').eq('userId', userId)
    if (res.error) {
        console.log(res.error)
        return []
    }
    return res.data
}