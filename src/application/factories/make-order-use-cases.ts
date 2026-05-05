import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaOrderRepository } from '../../infra/repositories/prisma-order-repository'
import { PrismaCartRepository } from '../../infra/repositories/prisma-cart-repository'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { CreateOrderUseCase } from '../use-cases/order/create-order'
import { GetUserOrdersUseCase } from '../use-cases/order/get-all-order'
import { CancelOrderUseCase } from '../use-cases/order/cancel-order'
import { PayOrderUseCase } from '../use-cases/order/pay-order'

export function makeOrderUseCases(tx: PrismaTransactionClient) {
    const orderRepository = new PrismaOrderRepository(tx)
    const cartRepository = new PrismaCartRepository(tx)
    const productRepository = new PrismaProductRepository(tx)

    return {
        createOrder: new CreateOrderUseCase(orderRepository, cartRepository, productRepository),
        getUserOrders: new GetUserOrdersUseCase(orderRepository),
        cancelOrder: new CancelOrderUseCase(orderRepository),
        payOrder: new PayOrderUseCase(orderRepository),
    }
}
