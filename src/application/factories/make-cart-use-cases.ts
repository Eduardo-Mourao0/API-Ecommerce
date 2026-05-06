import { ITransactionManager, PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
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
    const cartRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaCartRepository(tx)
    const productRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaProductRepository(tx)

    return {
        addItemToCart: new AddItemToCartUseCase(transactionManager, cartRepositoryFactory, productRepositoryFactory),
        removeItemFromCart: new RemoveItemFromCartUseCase(transactionManager, cartRepositoryFactory),
        getCart: new GetCartUseCase(transactionManager, cartRepositoryFactory),
        clearCart: new ClearCartUseCase(transactionManager, cartRepositoryFactory),
    }
}

export type CartUseCases = ReturnType<typeof makeCartUseCases>
