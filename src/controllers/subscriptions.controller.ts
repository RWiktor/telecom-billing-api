import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'
import { validate } from '../utils/validation'
import {
  idParamSchema,
  usageQuerySchema,
  createSubscriptionSchema,
} from '../schemas/subscriptions.schema'
import { Prisma } from '../../prisma/generated/client'

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

export const getSubscriptions = async (req: Request, res: Response) => {
  const subscriptions = await prisma.subscription.findMany({
    include: subscriptionInclude,
  })
  res.json(subscriptions)
}

export const getSubscriptionById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const subscription = await prisma.subscription.findUnique({
    where: { id },
    include: subscriptionInclude,
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

export const getSubscriptionInvoices = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const invoices = await prisma.invoice.findMany({
    where: { subscriptionId: id },
  })

  if (invoices.length === 0) {
    throw notFound('No invoices found')
  }

  res.json(invoices)
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
    include: subscriptionInclude,
  })

  res.status(201).json(subscription)
}

export const deleteSubscription = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  try {
    const deletedSubscription = await prisma.subscription.delete({
      where: { id },
    })
    res.status(204).json(deletedSubscription)
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw notFound('Subscription not found')
    }
    throw error
  }
}
