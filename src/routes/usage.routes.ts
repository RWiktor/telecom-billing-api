import express from 'express'
import type { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { createUsage, getUsageById } from '../controllers/usage.controller'

export const usageRouter: Router = express.Router()

usageRouter.use(authMiddleware)
usageRouter.get('/:id', getUsageById)
usageRouter.post('/', createUsage)
