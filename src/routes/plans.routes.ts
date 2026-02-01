import express from 'express'
import type { Router } from 'express'
import { getPlans, getPlanById } from '../controllers/plans.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const plansRouter: Router = express.Router()

plansRouter.use(authMiddleware)
plansRouter.get('/', getPlans)
plansRouter.get('/:id', getPlanById)
