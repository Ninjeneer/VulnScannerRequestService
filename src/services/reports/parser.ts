import { ProbeResult } from "../../models/probe"
import { NmapResult, NmapResults } from "../../models/results/nmap"
import { PROBE_NAMES } from "../../utils"
import { nmapParser } from "./parsers/nmap"

type Parser = (result: ProbeResult) => any

const noParser = (result: ProbeResult) => {
    return result
}

const dummyParser = (result: ProbeResult): ProbeResult<string> => {
    return {
        ...result,
        result: "tes test"
    }
}

export const getParserByProbeName = (name: string): Parser => {
    return {
        [PROBE_NAMES.PROBE_NMAP]: nmapParser,
        [PROBE_NAMES.PROBE_DUMMY]: dummyParser,
    }[name] || noParser
}