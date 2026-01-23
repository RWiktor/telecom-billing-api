import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound } from '../utils/errors'
import { validate } from '../utils/validation'
import { createUsageSchema, idParamSchema } from '../schemas/usage.schema'

export const getUsageById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const usage = await prisma.usageRecord.findUnique({
    where: { id },
  })
  if (!usage) {
    throw notFound('Usage not found')
  }
  res.json(usage)
}

export const createUsage = async (req: Request, res: Response) => {
  const { subscriptionId, timestamp, minutes, dataMB, smsCount } = validate(createUsageSchema, req.body)

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  })
  if (!subscription) {
    throw notFound('Subscription not found')
  }

  const usage = await prisma.usageRecord.create({
    data: {
      subscriptionId,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      minutes,
      dataMB,
      smsCount,
    },
  })

  res.status(201).json(usage)
}