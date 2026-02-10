import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const usageQuerySchema = z
  .object({
    year: z.coerce.number().int().min(2000).max(2100).optional(),
    month: z.coerce.number().int().min(1).max(12).optional(),
  })
  .refine((data) => !!data.year === !!data.month, {
    message: 'Both year and month are required when filtering by date',
  })

export const createSubscriptionSchema = z.object({
  planId: z.coerce.number().int().positive(),
  phoneNumber: z.string().regex(/^\+\d{11}$/, 'Format: +123456789012'),
})
