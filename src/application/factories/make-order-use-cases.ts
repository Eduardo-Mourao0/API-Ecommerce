import { ITransactionManager, TransactionContext } from '../../domain/managers/ITransactionManager'
import { prisma } from '../../infra/database/prisma/prisma-client'
import { PrismaRepositoryClient } from '../../infra/database/prisma/prisma-repository-client'
import { PrismaTransactionManager } from '../../infra/database/prisma/prisma-transaction-manager'
import { PrismaCartRepository } from '../../infra/repositories/prisma-cart-repository'
import { PrismaOrderRepository } from '../../infra/repositories/prisma-order-repository'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { CancelOrderUseCase } from '../use-cases/order/cancel-order'
import { CreateOrderUseCase } from '../use-cases/order/create-order'
import { GetUserOrdersUseCase } from '../use-cases/order/get-all-order'
import { PayOrderUseCase } from '../use-cases/order/pay-order'

export function makeOrderUseCases(
    transactionManager: ITransactionManager = new PrismaTransactionManager()
) {
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

    return {
        createOrder: new CreateOrderUseCase(
            transactionManager,
            orderRepositoryFactory,
            cartRepositoryFactory,
            productRepositoryFactory
        ),
        getUserOrders: new GetUserOrdersUseCase(orderRepository),
        cancelOrder: new CancelOrderUseCase(orderRepository),
        payOrder: new PayOrderUseCase(orderRepository),
    }
}

export type OrderUseCases = ReturnType<typeof makeOrderUseCases>
