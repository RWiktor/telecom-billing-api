import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'
import { validate } from '../utils/validation'
import { idParamSchema, generateInvoiceSchema } from '../schemas/invoices.schema'
import { InvoiceStatus } from '../../prisma/generated/client'
import { AuthRequest } from '../middleware/auth.middleware'
import { createInvoiceForSubscription } from '../services/invoices.service'

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
      where: {
        id,
        status: { in: [InvoiceStatus.UNPAID, InvoiceStatus.OVERDUE] },
        subscription: { userId },
      },
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

  const subscription = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId },
  })

  if (!subscription) {
    throw notFound('Subscription not found')
  }

  try {
    const invoice = await createInvoiceForSubscription({
      subscriptionId,
      year,
      month,
    })

    return res.status(201).json(invoice)
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw badRequest(`Invoice for ${month}-${year} already exists for this subscription`)
    }
    throw error
  }
}
