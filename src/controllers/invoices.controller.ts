import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'
import { validate } from '../utils/validation'
import { idParamSchema, generateInvoiceSchema } from '../schemas/invoices.schema'
import { InvoiceStatus, Prisma } from '../../prisma/generated/client'
import { AuthRequest } from '../middleware/auth.middleware'

export const getInvoices = async (req: AuthRequest, res: Response) => {
  const userId = req.userId

  const invoices = await prisma.invoice.findMany({ where: { subscription: { userId } } })
  res.json(invoices)
}

export const getInvoiceById = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const userId = req.userId

  const invoice = await prisma.invoice.findUnique({ where: { id, subscription: { userId } } })

  if (!invoice) {
    throw notFound('Invoice not found')
  }

  res.json(invoice)
}

export const payInvoice = async (req: AuthRequest, res: Response) => {
  const { id } = validate(idParamSchema, req.params)
  const userId = req.userId

  try {
    const paidInvoice = await prisma.invoice.update({
      where: { id, status: InvoiceStatus.UNPAID, subscription: { userId } },
      data: {
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
      },
    })
    res.json(paidInvoice)
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw notFound('Invoice not found or already paid')
    }
    throw error
  }
}

export const generateInvoice = async (req: AuthRequest, res: Response) => {
  const { subscriptionId, year, month } = validate(generateInvoiceSchema, req.body)
  const userId = req.userId

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId, userId },
    include: { plan: true },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  const usageAggregation = await prisma.usageRecord.aggregate({
    where: {
      subscriptionId,
      timestamp: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    _sum: {
      minutes: true,
      dataMB: true,
      smsCount: true,
    },
  })

  const totals = {
    minutes: Number(usageAggregation._sum.minutes || 0),
    dataMB: Number(usageAggregation._sum.dataMB || 0),
    smsCount: Number(usageAggregation._sum.smsCount || 0),
  }

  let overageFee = 0
  const p = subscription.plan

  const addOverage = (actual: number, limit: number | null, price: Prisma.Decimal | null) => {
    if (limit !== null && price !== null && actual > limit) {
      overageFee += (actual - limit) * price.toNumber()
    }
  }

  addOverage(totals.minutes, p.minutesLimit, p.overageMinutePrice)
  addOverage(totals.dataMB, p.dataMBLimit, p.overageDataPrice)
  addOverage(totals.smsCount, p.smsLimit, p.overageSmsPrice)

  const baseFee = p.monthlyFee.toNumber()
  const totalAmount = Math.round((baseFee + overageFee) * 100) / 100

  try {
    const invoice = await prisma.invoice.create({
      data: {
        subscriptionId,
        year,
        month,
        baseFee,
        overageFee,
        totalAmount,
      },
    })

    return res.status(201).json(invoice)
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw badRequest(`Invoice for ${month}-${year} already exists for this subscription`)
    }
    throw error
  }
}
