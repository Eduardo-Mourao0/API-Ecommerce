import { CancelOrderUseCase } from '../../../application/use-cases/order/cancel-order'
import { CreateOrderUseCase } from '../../../application/use-cases/order/create-order'
import { GetUserOrdersUseCase } from '../../../application/use-cases/order/get-all-order'
import { PayOrderUseCase } from '../../../application/use-cases/order/pay-order'
import { type TransactionContext } from '../../../domain/managers/ITransactionManager'
import { prisma } from '../../database/prisma/prisma-client'
import { type PrismaRepositoryClient } from '../../database/prisma/prisma-repository-client'
import { PrismaTransactionManager } from '../../database/prisma/prisma-transaction-manager'
import { PrismaCartRepository } from '../../repositories/prisma-cart-repository'
import { PrismaOrderRepository } from '../../repositories/prisma-order-repository'
import { PrismaProductRepository } from '../../repositories/prisma-product-repository'
import { OrderController } from '../controllers/order-controller'

export function makeOrderController(): OrderController {
    const transactionManager = new PrismaTransactionManager()
    const orderRepository = new PrismaOrderRepository(prisma)
    const orderRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaOrderRepository(tx as PrismaRepositoryClient)
    }
    const cartRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaCartRepository(tx as PrismaRepositoryClient)
    }
    const productRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaProductRepository(tx as PrismaRepositoryClient)
    }

    return new OrderController({
        createOrder: new CreateOrderUseCase(transactionManager, orderRepositoryFactory, cartRepositoryFactory, productRepositoryFactory),
        getUserOrders: new GetUserOrdersUseCase(orderRepository),
        cancelOrder: new CancelOrderUseCase(orderRepository),
        payOrder: new PayOrderUseCase(orderRepository),
    })
}
