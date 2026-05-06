import { makeOrderUseCases } from '../../../application/factories/make-order-use-cases'
import { OrderController } from '../controllers/order-controller'

export function makeOrderController(): OrderController {
    return new OrderController(makeOrderUseCases())
}
