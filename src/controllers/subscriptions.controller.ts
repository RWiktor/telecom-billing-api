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

  if (isNaN(Number(id))) {
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
