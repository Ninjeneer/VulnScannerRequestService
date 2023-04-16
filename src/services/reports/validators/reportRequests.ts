import { z } from 'zod'

export const getReportByIdRequest = z.string().regex(/[a-z0-9]{24}/)
export const getSupabaseReportByIdRequest = z.string().uuid()