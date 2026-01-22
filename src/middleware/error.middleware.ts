import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message || 'An error occurred',
    })
    return
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ')
    res.status(400).json({
      error: message,
    })
    return
  }

  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
  })
}
