import { Router } from 'express'
import { makeProductController } from '../factories/make-product-controller'
import { authMiddleware } from '../middlewares/auth-middleware'
import { roleMiddleware } from '../middlewares/role-middleware'

const productRoutes = Router()
const productController = makeProductController()

productRoutes.post(
    '/products',
    authMiddleware(),
    roleMiddleware(['ADMIN']),
    productController.create.bind(productController)
)
productRoutes.get('/products', productController.getAll.bind(productController))
productRoutes.get('/products/search', productController.getByName.bind(productController))
productRoutes.put(
    '/products/:id',
    authMiddleware(),
    roleMiddleware(['ADMIN']),
    productController.update.bind(productController)
)
productRoutes.delete(
    '/products/:id',
    authMiddleware(),
    roleMiddleware(['ADMIN']),
    productController.delete.bind(productController)
)

export { productRoutes }
