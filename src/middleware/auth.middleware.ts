import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth'

export interface AuthRequest extends Request {
  userId?: number
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      res.status(401).json({ error: 'No token provided' })
      return
    }

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Invalid token format. Use: Bearer <token>' })
      return
    }

    const token = authHeader.substring(7)

    const decoded = verifyToken(token)

    req.userId = decoded.userId

    next()
  } catch (error: any) {
    res.status(401).json({
      error: 'Invalid or expired token',
      details: error.message,
    })
  }
}
