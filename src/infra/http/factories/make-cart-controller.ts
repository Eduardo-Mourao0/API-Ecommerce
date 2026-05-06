import { makeCartUseCases } from '../../../application/factories/make-cart-use-cases'
import { CartController } from '../controllers/cart-controller'

export function makeCartController(): CartController {
    return new CartController(makeCartUseCases())
}
