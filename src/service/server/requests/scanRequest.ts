import { z } from 'zod'

export const createScanRequest = z.object({
    probes: z.array(z.object({
        name: z.string().trim(),
        target: z.string().trim(),
        settings: z.any()
    }))
})

export type CreateScanRequest = z.infer<typeof createScanRequest>