import { Router } from 'express'
import { makeCartController } from '../factories/make-cart-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

const cartRoutes = Router()
const cartController = makeCartController()

cartRoutes.use(authMiddleware())

cartRoutes.post('/cart/items', cartController.addItem.bind(cartController))
cartRoutes.delete('/cart/items/:cartItemId', cartController.removeItem.bind(cartController))
cartRoutes.get('/cart', cartController.get.bind(cartController))
cartRoutes.delete('/cart', cartController.clear.bind(cartController))

export { cartRoutes }
