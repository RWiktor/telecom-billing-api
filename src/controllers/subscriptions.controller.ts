import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'
import { validate } from '../utils/validation'
import {
  idParamSchema,
  usageQuerySchema,
  createSubscriptionSchema,
} from '../schemas/subscriptions.schema'

export const getSubscriptions = async (req: Request, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      plan: true,
    },
  })
  res.json(subscriptions)
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      plan: true,
    },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  res.json(subscription)
}

export const getSubscriptionUsage = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const query = validate(usageQuerySchema, req.query)

  const subscription = await prisma.subscription.findUnique({
    where: { id },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  const where: { subscriptionId: number; timestamp?: { gte: Date; lt: Date } } = {
    subscriptionId: id,
  }

  if (query.year && query.month) {
    where.timestamp = {
      gte: new Date(query.year, query.month - 1, 1),
      lt: new Date(query.year, query.month, 1),
    }
  }

  const usage = await prisma.usageRecord.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  })

  const summary = usage.reduce(
    (acc, curr) => ({
      totalMinutes: acc.totalMinutes + curr.minutes,
      totalDataMB: acc.totalDataMB + curr.dataMB,
      totalSms: acc.totalSms + curr.smsCount,
    }),
    { totalMinutes: 0, totalDataMB: 0, totalSms: 0 },
  )

  res.json({
    records: usage,
    summary,
  })
}

export const createSubscription = async (req: Request, res: Response) => {
  const data = validate(createSubscriptionSchema, req.body)

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  })

  if (!user) {
    throw notFound('User not found')
  }

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
      userId: data.userId,
      planId: data.planId,
      phoneNumber: data.phoneNumber,
      startDate: new Date(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      plan: true,
    },
  })

  res.status(201).json(subscription)
}
