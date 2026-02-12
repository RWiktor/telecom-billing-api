import type { Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'
import { validate } from '../utils/validation'
import {
  idParamSchema,
  usageQuerySchema,
  createSubscriptionSchema,
} from '../schemas/subscriptions.schema'
import { Prisma } from '../../prisma/generated/client'
import { AuthRequest } from '../middleware/auth.middleware'

const userSelect: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
}

const subscriptionInclude: Prisma.SubscriptionInclude = {
  user: {
    select: userSelect,
  },
  plan: true,
}

export const getSubscriptions = async (req: AuthRequest, res: Response) => {
  const userId = req.userId
  const subscriptions = await prisma.subscription.findMany({
    where: { userId },
    include: subscriptionInclude,
  })
  res.json(subscriptions)
}

export const getSubscriptionById = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const userId = req.userId

  const subscription = await prisma.subscription.findUnique({
    where: { id, userId },
    include: subscriptionInclude,
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  res.json(subscription)
}

export const getSubscriptionUsage = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const query = validate(usageQuerySchema, req.query)
  const userId = req.userId

  const subscription = await prisma.subscription.findUnique({
    where: { id, userId },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  const where: any = { subscriptionId: id }

  if (query.year && query.month) {
    where.timestamp = {
      gte: new Date(query.year, query.month - 1, 1),
      lt: new Date(query.year, query.month, 1),
    }
  }

  const [usage, aggregation] = await Promise.all([
    prisma.usageRecord.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    }),
    prisma.usageRecord.aggregate({
      where,
      _sum: {
        minutes: true,
        dataMB: true,
        smsCount: true,
      },
    }),
  ])

  res.json({
    records: usage,
    summary: {
      totalMinutes: aggregation._sum.minutes || 0,
      totalDataMB: aggregation._sum.dataMB || 0,
      totalSms: aggregation._sum.smsCount || 0,
    },
  })
}

export const getSubscriptionInvoices = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const userId = req.userId

  const invoices = await prisma.invoice.findMany({
    where: { subscriptionId: id, subscription: { userId } },
  })

  if (invoices.length === 0) {
    throw notFound('No invoices found')
  }

  res.json(invoices)
}

export const createSubscription = async (req: AuthRequest, res: Response) => {
  const data = validate(createSubscriptionSchema, req.body)
  const userId = req.userId!

  const plan = await prisma.plan.findUnique({
    where: { id: data.planId },
  })

  if (!plan) {
    throw notFound('Plan not found')
  }

  const existingPhone = await prisma.subscription.findUnique({
    where: { phoneNumber: data.phoneNumber },
  })

  if (existingPhone) {
    throw badRequest('Phone number already in use')
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId: data.planId,
      phoneNumber: data.phoneNumber,
      startDate: new Date(),
    },
    include: subscriptionInclude,
  })

  res.status(201).json(subscription)
}

// not sure about this, at this moment only for testing
export const deleteSubscription = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const userId = req.userId!

  const subscription = await prisma.subscription.findFirst({
    where: { id, userId },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  await prisma.subscription.delete({
    where: { id },
  })

  res.status(204).send()
}
