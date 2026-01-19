import express from 'express'
import type { Router } from 'express'
import { getUsers, getUserById } from '../controllers/users.controller'

export const usersRouter: Router = express.Router()

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUserById)
