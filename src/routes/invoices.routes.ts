import express from 'express'
import type { Router } from 'express'
import { getInvoiceById, getInvoices, payInvoice } from '../controllers/invoices.controller'

export const invoicesRouter: Router = express.Router()

invoicesRouter.get('/', getInvoices)
invoicesRouter.get('/:id', getInvoiceById)
invoicesRouter.patch('/:id/pay', payInvoice)
