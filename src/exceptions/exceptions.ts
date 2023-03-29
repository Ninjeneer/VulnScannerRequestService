export class ScanDoesNotExist extends Error {
    constructor() {
        super('Scan does not exist')
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