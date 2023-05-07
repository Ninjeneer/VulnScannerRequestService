import { z } from 'zod'

export const createCheckoutSessionRequest = z.object({
    priceId: z.string(),
    isUpdate: z.boolean().optional().default(false)
})

export const webhookEventRequest = z.object({
    data: z.any(),
    type: z.string()
})