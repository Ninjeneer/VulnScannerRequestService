import { ProbeStartData } from '../models/probe'
import { ScanStartData, ScanWithProbes } from '../models/scan'
import { ScanUpdatePayload } from './dto/scan.dto'
import supabaseClient from './supabase'


export const saveProbesStartData = async (probes: ProbeStartData[]) => {
    await supabaseClient.from('probes').insert(probes)
}

export const saveScanStartData = async (scan: ScanStartData): Promise<{ scanId: string }> => {
    await supabaseClient.from('scans').insert(scan)
    return { scanId: scan.id }
}

export const getScan = async (scanId: string): Promise<ScanWithProbes> => {
    return (await supabaseClient.from('scans').select('*, probes(*)').eq('id', scanId).single()).data as ScanWithProbes
}

export const updateScan = async (id: string, data: Partial<ScanUpdatePayload>): Promise<void> => {
    await supabaseClient.from('scans').update(data).eq('id', id)
}