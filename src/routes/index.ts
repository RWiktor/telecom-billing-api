import express from 'express'
import type { Router } from 'express'
import { usersRouter } from './users.routes'
import { plansRouter } from './plans.routes'
import { subscriptionsRouter } from './subscriptions.routes'

export const indexRouter: Router = express.Router()

indexRouter.use('/users', usersRouter)
indexRouter.use('/plans', plansRouter)
indexRouter.use('/subscriptions', subscriptionsRouter)
