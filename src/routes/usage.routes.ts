import express from 'express'
import type { Router } from 'express'
import { createUsage, getUsageById } from '../controllers/usage.controller'

export const usageRouter: Router = express.Router()

usageRouter.get('/:id', getUsageById)
usageRouter.post('/', createUsage)
