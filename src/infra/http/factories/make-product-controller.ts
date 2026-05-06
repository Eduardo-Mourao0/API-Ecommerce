import { makeProductUseCases } from '../../../application/factories/make-product-use-cases'
import { ProductController } from '../controllers/product-controller'

export function makeProductController(): ProductController {
    return new ProductController(makeProductUseCases())
}
