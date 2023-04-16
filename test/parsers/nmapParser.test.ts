import { ProbeResult } from "../../src/models/probe"
import { NmapResult, NmapResults } from "../../src/models/results/nmap"
import { nmapParser } from "../../src/services/reports/parsers/nmap"

describe('Nmap Parser tests', () => {
    it('should remove the REJECT CVEs', () => {
        const res = {
            result: [
                {
                    cves: [
                        {
                            descriptions: [
                                { lang: 'en', value: '** REJECT ** DO NOT USE THIS CANDIDATE NUMBER bla bla bla' }
                            ]
                        }
                    ]
                }
            ]
        } as ProbeResult<NmapResults>
        expect(nmapParser(res).result[0].cves).toHaveLength(0)

        const res2 = {
            result: [{
                cves: [
                    {
                        descriptions: [
                            { lang: 'en', value: '** REJECT ** DO NOT USE THIS CANDIDATE NUMBER bla bla bla' }
                        ]
                    },
                    {
                        descriptions: [
                            { lang: 'en', value: 'A good description' }
                        ]
                    },
                    {
                        descriptions: [
                            { lang: 'en', value: '** REJECT ** DO NOT USE THIS CANDIDATE NUMBER bla bla bla' }
                        ]
                    }
                ]
            }]
        } as ProbeResult<NmapResults>
        expect(nmapParser(res2).result).toHaveLength(1)
        expect(nmapParser(res2).result[0].cves[0].descriptions[0].value).toBe('A good description')
    })
})