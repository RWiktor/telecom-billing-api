import { z } from 'zod'
import { badRequest } from './errors'

export const validate = <T>(schema: z.Schema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw badRequest(message)
    }
    throw error
  }
}
