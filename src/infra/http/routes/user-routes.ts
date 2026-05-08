import { Router } from 'express'
import { makeUserController } from '../factories/make-user-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

const userRoutes = Router()
const userController = makeUserController()

userRoutes.post('/users', userController.create.bind(userController))
userRoutes.post('/login', userController.login.bind(userController))
userRoutes.get('/users', authMiddleware(), userController.getAll.bind(userController))
userRoutes.delete('/users/me', authMiddleware(), userController.delete.bind(userController))

export { userRoutes }
