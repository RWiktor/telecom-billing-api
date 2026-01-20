import express from 'express'
import type { Router } from 'express'
import { getPlans, getPlanById } from '../controllers/plans.controller'

export const plansRouter: Router = express.Router()

plansRouter.get('/', getPlans)
plansRouter.get('/:id', getPlanById)
