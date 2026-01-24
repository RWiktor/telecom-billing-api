import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound } from '../utils/errors'
import { validate } from '../utils/validation'
import { idParamSchema } from '../schemas/invoices.schema'

export const getInvoices = async (req: Request, res: Response) => {
  const invoices = await prisma.invoice.findMany()
  res.json(invoices)
}

export const getInvoiceById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const invoice = await prisma.invoice.findUnique({ where: { id } })

  if (!invoice) {
    throw notFound('Invoice not found')
  }

  res.json(invoice)
}
