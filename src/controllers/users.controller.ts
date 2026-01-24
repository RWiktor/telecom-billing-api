import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound } from '../utils/errors'
import { validate } from '../utils/validation'
import { emailParamSchema, idParamSchema } from '../schemas/users.schema'
import { Prisma } from '../../prisma/generated/client'

const userSelect: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  createdAt: true,
  updatedAt: true,
}

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: userSelect,
  })
  res.json(users)
}

export const getUserById = async (req: Request, res: Response) => {
  const { id } = validate(idParamSchema, req.params)

  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelect,
  })

  if (!user) {
    throw notFound('User not found')
  }

  res.json(user)
}

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = validate(emailParamSchema, req.params)

  const user = await prisma.user.findUnique({
    where: { email },
    select: userSelect,
  })

  if (!user) {
    throw notFound('User not found')
  }

  res.json(user)
}
