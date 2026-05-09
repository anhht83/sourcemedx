import { Router } from 'express'
import { auth } from '../middlewares/auth'
import { UserController } from '../controllers/user.controller'

export const userRouter = Router()
const controller = new UserController()

userRouter.get('/me', auth, controller.me)
