import express from 'express'
import type { Router } from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import { getInvoiceById, getInvoices, payInvoice } from '../controllers/invoices.controller'

export const invoicesRouter: Router = express.Router()

invoicesRouter.use(authMiddleware)
invoicesRouter.get('/', getInvoices)
invoicesRouter.get('/:id', getInvoiceById)
invoicesRouter.patch('/:id/pay', payInvoice)
