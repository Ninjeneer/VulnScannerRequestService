import { z } from 'zod'

export const createScanRequest = z.object({
    target: z.string().trim(),
    probes: z.array(z.object({
        name: z.string().trim(),
        settings: z.any()
    }))
})

export type CreateScanRequest = z.infer<typeof createScanRequest>