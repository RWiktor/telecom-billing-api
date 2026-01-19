import type { Request, Response } from 'express'
import { prisma } from '../db'
import { notFound, badRequest } from '../utils/errors'

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  res.json(users)
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const {id} = req.params

  if (isNaN(Number(id))) {
    throw badRequest('Invalid user ID')
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) {
    throw notFound('User not found')
  }

  res.json(user)
}
