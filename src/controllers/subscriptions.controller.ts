import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'

export const getSubscriptions = async (req: Request, res: Response): Promise<void> => {
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

export const getSubscriptionById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params

  if (isNaN(Number(id)) || Number(id) <= 0) {
    throw badRequest('Invalid subscription ID')
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: Number(id) },
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

export const getSubscriptionUsage = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  const { id } = req.params
  const { year, month } = req.query

  if (isNaN(Number(id)) || Number(id) <= 0) {
    throw badRequest('Invalid subscription ID')
  }

  const subscription = await prisma.subscription.findUnique({
    where: { id: Number(id) },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  const where: any = { subscriptionId: Number(id) }

  if (year && month) {
    const yearNum = Number(year)
    const monthNum = Number(month)

    if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) {
      throw badRequest('Invalid year. Must be between 2000 and 2100')
    }

    if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      throw badRequest('Invalid month. Must be between 1 and 12')
    }

    where.timestamp = {
      gte: new Date(yearNum, monthNum - 1, 1),
      lt: new Date(yearNum, monthNum, 1),
    }
  } else if (year || month) {
    throw badRequest('Both year and month are required when filtering by date')
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
