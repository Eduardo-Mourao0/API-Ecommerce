import { ITransactionManager, PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
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
    const orderRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaOrderRepository(tx)
    const cartRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaCartRepository(tx)
    const productRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaProductRepository(tx)

    return {
        createOrder: new CreateOrderUseCase(
            transactionManager,
            orderRepositoryFactory,
            cartRepositoryFactory,
            productRepositoryFactory
        ),
        getUserOrders: new GetUserOrdersUseCase(transactionManager, orderRepositoryFactory),
        cancelOrder: new CancelOrderUseCase(transactionManager, orderRepositoryFactory),
        payOrder: new PayOrderUseCase(transactionManager, orderRepositoryFactory),
    }
}

export type OrderUseCases = ReturnType<typeof makeOrderUseCases>
