import { Router } from 'express'
import { makeProductController } from '../factories/make-product-controller'
import { authMiddleware } from '../middlewares/auth-middleware'

const productRoutes = Router()
const productController = makeProductController()

productRoutes.post('/products', authMiddleware(), productController.create.bind(productController))
productRoutes.get('/products', productController.getAll.bind(productController))
productRoutes.get('/products/search', productController.getByName.bind(productController))
productRoutes.put('/products/:id', authMiddleware(), productController.update.bind(productController))
productRoutes.delete('/products/:id', authMiddleware(), productController.delete.bind(productController))

export { productRoutes }
