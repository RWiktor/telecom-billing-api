import express from 'express'
import type { Router } from 'express'
import { login, getMe } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const authRouter: Router = express.Router()

authRouter.post('/login', login)
authRouter.get('/me', authMiddleware, getMe)
