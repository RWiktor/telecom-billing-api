import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export const emailParamSchema = z.object({
  email: z.string().email(),
})
