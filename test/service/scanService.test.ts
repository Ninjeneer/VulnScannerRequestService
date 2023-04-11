import { createScanRequest, CreateScanRequest } from "../../src/services/requests/validators/scanRequest";
import { ScanStatus } from '../../src/models/scan'
import { requestScan } from "../../src/services/requests/scanService";
import { saveScanStartData, saveProbesStartData } from "../../src/storage/scan.storage";
import { publishProbeRequest } from "../../src/storage/awsSqsQueue";


jest.mock('../../src/storage/scan.storage')
jest.mock('../../src/storage/awsSqsQueue')


describe('Scan Service Tests', () => {

    it('should request a scan', async () => {
        const scanRequest: CreateScanRequest = {
            target: 'test.com',
            periodicity: '* * * * *',
            probes: [
                { name: 'probe-nmap', settings: {} } 
            ]
        }
        const response = await requestScan(scanRequest);
        expect(response.scanId).toBeDefined()
        expect(saveScanStartData).toHaveBeenCalledWith({
            id: response.scanId,
            status: ScanStatus.PENDING,
            notification: false,
            target: scanRequest.target,
            periodicity: '* * * * *'
        });
        expect(saveProbesStartData).toHaveBeenCalledWith([
            {
                id: expect.any(String),
                status: ScanStatus.PENDING,
                scanId: response.scanId
            }
        ]);
        expect(publishProbeRequest).toHaveBeenCalledWith([{
            context: {
                id: expect.any(String),
                name: 'probe-nmap',
                target: scanRequest.target
            },
            settings: {}
        }]);
    })

    it('should not accept an invalid scan request', () => {
        expect(() => createScanRequest.parse({ target: 'test.com' })).toThrow()
        expect(() => createScanRequest.parse({ target: 'test.com', probes: [{}] })).toThrow()
        expect(() => createScanRequest.parse({ target: 'test.com', probes: [{ settings: {} }] })).toThrow()
    })
})