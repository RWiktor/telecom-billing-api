import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'

export const getPlans = async (req: Request, res: Response): Promise<void> => {
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyFee: 'asc' },
  })
  res.json(plans)
}

export const getPlanById = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  const { id } = req.params

  if (isNaN(Number(id)) || Number(id) <= 0) {
    throw badRequest('Invalid plan ID')
  }
  const plan = await prisma.plan.findUnique({
    where: { id: Number(id) },
  })
  if (!plan) {
    throw notFound('Plan not found')
  }
  res.json(plan)
}
