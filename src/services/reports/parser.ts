import { ProbeResult } from "../../models/probe"
import { PROBE_NAMES } from "../../utils"

type Parser = (result: ProbeResult) => any

const noParser = (result: ProbeResult) => {
    return result
}

const nmapParser = (result: ProbeResult) => {
    return result
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