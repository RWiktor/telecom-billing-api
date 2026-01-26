import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const currentYear: number = new Date().getFullYear()

export const generateInvoiceSchema = z.object({
  subscriptionId: z.coerce.number().int().positive(),
  year: z.coerce.number().int().positive().min(2025).max(currentYear),
  month: z.coerce.number().int().positive().min(1).max(12),
})
