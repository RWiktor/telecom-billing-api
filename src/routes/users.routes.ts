import express from 'express'
import type { Router } from 'express'
import { getUsers, getUserById, getUserByEmail } from '../controllers/users.controller'
import { authMiddleware } from '../middleware/auth.middleware'

export const usersRouter: Router = express.Router()

usersRouter.use(authMiddleware)
usersRouter.get('/', getUsers)
usersRouter.get('/email/:email', getUserByEmail)
usersRouter.get('/:id', getUserById)
