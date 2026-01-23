import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const createUsageSchema = z.object({
  subscriptionId: z.coerce.number().int().positive(),
  timestamp: z.coerce.date().optional(),
  minutes: z.coerce.number().int().positive(),
  dataMB: z.coerce.number().int().positive(),
  smsCount: z.coerce.number().int().positive(),
})