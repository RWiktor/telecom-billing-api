import 'dotenv/config'
import { Prisma, PrismaClient } from '../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter: pool })

const PORT = process.env.PORT || 8000
const app = express()
app.use(cors())

app.use(express.json())

//test
app.get('/users', async (req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: 'No route found' })
})

app.listen(PORT, (): void => {
  console.log('Listening on port: ', PORT)
})
