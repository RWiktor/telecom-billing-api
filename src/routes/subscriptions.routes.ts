import express from 'express'
import type { Router } from 'express'
import {
  getSubscriptions,
  getSubscriptionById,
  getSubscriptionUsage,
  createSubscription,
} from '../controllers/subscriptions.controller'

export const subscriptionsRouter: Router = express.Router()

subscriptionsRouter.get('/', getSubscriptions)
subscriptionsRouter.post('/', createSubscription)
subscriptionsRouter.get('/:id/usage', getSubscriptionUsage)
subscriptionsRouter.get('/:id', getSubscriptionById)
