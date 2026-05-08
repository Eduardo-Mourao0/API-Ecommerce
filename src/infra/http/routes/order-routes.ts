import { Router } from 'express'
import { makeOrderController } from '../factories/make-order-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

const orderRoutes = Router()
const orderController = makeOrderController()

orderRoutes.use(authMiddleware())

orderRoutes.post('/orders', orderController.create.bind(orderController))
orderRoutes.get('/orders', orderController.getAll.bind(orderController))
orderRoutes.patch('/orders/:orderId/cancel', orderController.cancel.bind(orderController))
orderRoutes.patch('/orders/:orderId/pay', orderController.pay.bind(orderController))

export { orderRoutes }
