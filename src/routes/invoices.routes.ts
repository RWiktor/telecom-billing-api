import express from 'express'
import type { Router } from 'express'
import { getInvoiceById, getInvoices } from '../controllers/invoices.controller'

export const invoicesRouter: Router = express.Router()

invoicesRouter.get('/', getInvoices)
invoicesRouter.get('/:id', getInvoiceById)
