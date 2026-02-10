import express from 'express'
import type { Router } from 'express'
import { authRouter } from './auth.routes'
import { usersRouter } from './users.routes'
import { plansRouter } from './plans.routes'
import { usageRouter } from './usage.routes'
import { subscriptionsRouter } from './subscriptions.routes'
import { invoicesRouter } from './invoices.routes'

export const indexRouter: Router = express.Router()

indexRouter.use('/auth', authRouter)
// indexRouter.use('/users', usersRouter) // disabled for now
indexRouter.use('/plans', plansRouter)
indexRouter.use('/subscriptions', subscriptionsRouter)
// indexRouter.use('/usage', usageRouter) // disabled for now
indexRouter.use('/invoices', invoicesRouter)
