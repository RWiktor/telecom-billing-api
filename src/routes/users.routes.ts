import express from 'express'
import type { Router } from 'express'
import { getUsers, getUserById, getUserByEmail } from '../controllers/users.controller'

export const usersRouter: Router = express.Router()

usersRouter.get('/', getUsers)
usersRouter.get('/email/:email', getUserByEmail)
usersRouter.get('/:id', getUserById)
