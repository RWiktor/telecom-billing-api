import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express'
import { errorHandler } from './middleware/error.middleware'
import { indexRouter } from './routes'
import { ensurePreviousMonthInvoices } from './jobs/invoice-startup.job'

const PORT = process.env.PORT || 8000
const app = express()
app.use(cors())

app.use(express.json())

app.use('/api', indexRouter)

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'No route found' })
})

app.use(errorHandler)

const startServer = async () => {
  try {
    await ensurePreviousMonthInvoices()
  } catch (error) {
    console.error('[startup] Failed to ensure previous month invoices:', error)
  }

  app.listen(PORT, (): void => {
    console.log('Listening on port: http://localhost:' + PORT)
  })
}

void startServer()
