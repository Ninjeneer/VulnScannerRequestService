import IScanService from "../../src/service/scan/interfaces/scanServiceInterface"
import ScanService from "../../src/service/scan/scanService";
import { ScanStatus } from "../../src/service/scan/types/startData";
import { createScanRequest, CreateScanRequest } from "../../src/service/server/requests/scanRequest";
import AwsSqsQueue from "../../src/storage/messagequeue/awsSqsQueue";
import SupabaseStorage from "../../src/storage/scans/supabaseStorage";

jest.mock('../../src/storage/scans/supabaseStorage.ts')
jest.mock('../../src/storage/messagequeue/awsSqsQueue.ts')

describe('Scan Service Tests', () => {
    let scanService: IScanService;
    let supabaseStorage: SupabaseStorage;
    let awsSqsQueue: AwsSqsQueue;

    let spySaveScanStartData: jest.SpyInstance;
    let spySaveProbeStartData: jest.SpyInstance;
    let spyPublishProbeRequest: jest.SpyInstance;

    beforeEach(() => {
        supabaseStorage = new SupabaseStorage();
        awsSqsQueue = new AwsSqsQueue();
        scanService = new ScanService(supabaseStorage, awsSqsQueue);
        spySaveScanStartData = jest.spyOn(supabaseStorage, 'saveScanStartData');
        spySaveProbeStartData = jest.spyOn(supabaseStorage, 'saveProbesStartData');
        spyPublishProbeRequest = jest.spyOn(awsSqsQueue, 'publishProbeRequest');
    })

    it('should request a scan', async () => {
        const scanRequest: CreateScanRequest = {
            target: 'test.com',
            periodicity: '* * * * *',
            probes: [
                { name: 'probe-nmap', settings: {} } 
            ]
        }
        const response = await scanService.requestScan(scanRequest);
        expect(response.scanId).toBeDefined()
        expect(spySaveScanStartData).toHaveBeenCalledWith({
            id: response.scanId,
            status: ScanStatus.PENDING,
            notification: false,
            target: scanRequest.target,
            periodicity: '* * * * *'
        });
        expect(spySaveProbeStartData).toHaveBeenCalledWith([
            {
                id: expect.any(String),
                status: ScanStatus.PENDING,
                scanId: response.scanId
            }
        ]);
        expect(spyPublishProbeRequest).toHaveBeenCalledWith([{
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