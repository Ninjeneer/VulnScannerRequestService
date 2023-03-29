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
    constructor() {
        super('Report does not exist')
    }
}