import { ProbeResult } from "../../models/probe"
import { NmapResult, NmapResults } from "../../models/results/nmap"
import { PROBE_NAMES } from "../../utils"

type Parser = (result: ProbeResult) => any

const noParser = (result: ProbeResult) => {
    return result
}

export const nmapParser = (probeResult: ProbeResult<NmapResults>): ProbeResult<NmapResults> => {
    const descriptionIgnorePatterns = [
        /\*\* REJECT \*\* DO NOT USE THIS CANDIDATE NUMBER/
    ]

    const finalResults = []
    for (const res of probeResult.result) {
        if (descriptionIgnorePatterns.some((pattern) => res.descriptions.map((d) => d.value).some((description) => pattern.test(description)))) {
            console.log(`Ignoring ${res.id}`)
            continue
        }
        finalResults.push(res)
    }
    return {
        ...probeResult,
        result: finalResults
    }
}

const dummyParser = (result: ProbeResult) => {
    return result
}

export const getParserByProbeName = (name: string): Parser => {
    return {
        [PROBE_NAMES.PROBE_NMAP]: nmapParser,
        [PROBE_NAMES.PROBE_DUMMY]: dummyParser,
    }[name] || noParser
}