import express from 'express'
import type { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import {
  getSubscriptions,
  getSubscriptionById,
  getSubscriptionUsage,
  getSubscriptionInvoices,
  createSubscription,
} from '../controllers/subscriptions.controller'

export const subscriptionsRouter: Router = express.Router()

subscriptionsRouter.use(authMiddleware)
subscriptionsRouter.get('/', getSubscriptions)
subscriptionsRouter.post('/', createSubscription)
subscriptionsRouter.get('/:id/usage', getSubscriptionUsage)
subscriptionsRouter.get('/:id/invoices', getSubscriptionInvoices)
subscriptionsRouter.get('/:id', getSubscriptionById)
