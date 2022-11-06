import { requireEnvVars } from "../../src/utils"

describe('Utils Tests', () => {
    const env = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...env }
    })

    it('should throw an error if env var is not provided', () => {
        delete env.MONGO_URL
        expect(() => requireEnvVars(['MONGO_URL'])).toThrowError('Missing environment variable: MONGO_URL')
    })

    it('should not throw an error if env var is provided', () => {
        process.env.MONGO_URL = 'a_mongo_url'
        expect(() => requireEnvVars(['MONGO_URL'])).not.toThrow()
    })
})