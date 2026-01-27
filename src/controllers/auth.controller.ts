import type { Response } from 'express'
import { prisma } from '../db'
import { unauthorized, notFound } from '../utils/errors'
import { validate } from '../utils/validation'
import { loginSchema } from '../schemas/auth.schema'
import { comparePassword, generateToken } from '../utils/auth'
import type { AuthRequest } from '../middleware/auth.middleware'
import { Prisma } from '../../prisma/generated/client'

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
}

export const login = async (req: AuthRequest, res: Response) => {
  const { email, password } = validate(loginSchema, req.body)

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw unauthorized('Invalid email or password')
  }

  const isPasswordValid = await comparePassword(password, user.password)

  if (!isPasswordValid) {
    throw unauthorized('Invalid email or password')
  }

  const token = generateToken(user.id)

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.userId) {
    throw unauthorized('User not authenticated')
  }

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: userSelect,
  })

  if (!user) {
    throw notFound('User not found')
  }

  res.json(user)
}
