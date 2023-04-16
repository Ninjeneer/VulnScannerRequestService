export class ScanDoesNotExist extends Error {
    constructor(id = "") {
        super(`Scan ${id} does not exist`)
    }
}

export class ProbeDoesNotExist extends Error {
    constructor() {
        super('Probe does not exist')
    }
}

export class ReportDoesNotExist extends Error {
    constructor(id = "") {
        super(`Report ${id} does not exist`)
    }
}

export class NoProbeResultsForReport extends Error {
    constructor(id = "") {
        super(`No probe results for report ${id} found`)
    }
}