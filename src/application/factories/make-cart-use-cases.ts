import { ITransactionManager, TransactionContext } from '../../domain/managers/ITransactionManager'
import { prisma } from '../../infra/database/prisma/prisma-client'
import { PrismaTransactionClient } from '../../infra/database/prisma/prisma-transaction-client'
import { PrismaTransactionManager } from '../../infra/database/prisma/prisma-transaction-manager'
import { PrismaCartRepository } from '../../infra/repositories/prisma-cart-repository'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { AddItemToCartUseCase } from '../use-cases/cart/add-item-to-cart'
import { ClearCartUseCase } from '../use-cases/cart/clear-cart'
import { GetCartUseCase } from '../use-cases/cart/get-cart'
import { RemoveItemFromCartUseCase } from '../use-cases/cart/remove-item-from-cart'

export function makeCartUseCases(
    transactionManager: ITransactionManager = new PrismaTransactionManager()
) {
    const cartRepository = new PrismaCartRepository(prisma)
    const cartRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaCartRepository(tx as PrismaTransactionClient)
    }
    const productRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaProductRepository(tx as PrismaTransactionClient)
    }

    return {
        addItemToCart: new AddItemToCartUseCase(transactionManager, cartRepositoryFactory, productRepositoryFactory),
        removeItemFromCart: new RemoveItemFromCartUseCase(transactionManager, cartRepositoryFactory),
        getCart: new GetCartUseCase(cartRepository),
        clearCart: new ClearCartUseCase(cartRepository),
    }
}

export type CartUseCases = ReturnType<typeof makeCartUseCases>
