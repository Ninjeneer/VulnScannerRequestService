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

export class UserDoesNotExist extends Error {
    constructor(id = "") {
        super(`User id ${id} does not exist`)
    }
}

export class UserHasNotEnoughCredits extends Error {
    constructor(id = "") {
        super(`User id ${id} has not enough credits`)
    }
}

export class StripePriceDoesNotExist extends Error {
    constructor(id = "") {
        super(`Stripe Price ${id} does not exist`)
    }
}

export class MissingData extends Error {
    constructor(fieldName = "", source = "") {
        super(`Missing ${fieldName} in ${source}`)
    }
}

export class StripeProductDoesNotExist extends Error {
    constructor(id = "") {
        super(`Stripe Product ${id} does not exist`)
    }
}