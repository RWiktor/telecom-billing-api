import express from 'express'
import type { Express } from 'express'
import type { Request, Response } from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 8000
const app: Express = express()

app.use(cors())

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'No route found' })
})

app.listen(PORT, (): void => {
  console.log('Listening on port: ', PORT)
})
