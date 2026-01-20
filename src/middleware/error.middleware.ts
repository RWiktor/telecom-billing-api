import type { Request, Response, NextFunction } from 'express'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  if (err.statusCode) {
    res.status(err.statusCode).json({
      error: err.message || 'An error occurred',
    })
    return
  }

  console.error('Error:', err)
  res.status(500).json({
    error: 'Internal server error',
  })
}
