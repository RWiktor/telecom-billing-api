import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound } from '../utils/errors'
import { validate } from '../utils/validation'
import { idParamSchema } from '../schemas/plans.schema'

export const getPlans = async (req: Request, res: Response) => {
  const plans = await prisma.plan.findMany({
    orderBy: { monthlyFee: 'asc' },
  })
  res.json(plans)
}

export const getPlanById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const plan = await prisma.plan.findUnique({
    where: { id },
  })
  if (!plan) {
    throw notFound('Plan not found')
  }
  res.json(plan)
}
