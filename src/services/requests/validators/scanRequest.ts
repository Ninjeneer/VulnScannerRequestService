import { z } from 'zod'

export const createScanRequest = z.object({
    target: z.string().trim(),
    periodicity: z.string().trim(),
    probes: z.array(z.object({
        name: z.string().trim(),
        settings: z.object({}).optional()
    })),
    user_id: z.string()
})

export type CreateScanRequest = z.infer<typeof createScanRequest>

export const updateScanRequest = createScanRequest.deepPartial()
export type UpdateScanRequest = z.infer<typeof updateScanRequest>