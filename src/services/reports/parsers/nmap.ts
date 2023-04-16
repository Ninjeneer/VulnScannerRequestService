import { ProbeResult } from "../../../models/probe"
import { NmapResult, NmapResults } from "../../../models/results/nmap"

export const cleanCVEs = (cves: NmapResult['cves']) => {
    // Criterias
    const fragmentsToIgnore = [
        'DO NOT USE THIS CANDIDATE NUMBER'
    ]
    const allowedLanguages = ['fr', 'en']

    return cves.filter((cve) => {
        const descriptions = cve.descriptions.filter((description) => {
            if (!allowedLanguages.includes(description.lang)) {
                return false
            }

            if (fragmentsToIgnore.some((fragment) => description.value.includes(fragment))) {
                return false
            }
            return true
        })

        return descriptions.length > 0
    })
}

export const nmapParser = (probeResult: ProbeResult<NmapResults>): ProbeResult<NmapResults> => {

    return {
        ...probeResult,
        result: probeResult.result.map((res) => ({
            ...res,
            cves: cleanCVEs(res.cves)
        }))
    }
}