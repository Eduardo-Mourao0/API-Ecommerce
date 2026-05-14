import { AddItemToCartUseCase } from '../../../application/use-cases/cart/add-item-to-cart'
import { ClearCartUseCase } from '../../../application/use-cases/cart/clear-cart'
import { GetCartUseCase } from '../../../application/use-cases/cart/get-cart'
import { RemoveItemFromCartUseCase } from '../../../application/use-cases/cart/remove-item-from-cart'
import { type TransactionContext } from '../../../domain/managers/ITransactionManager'
import { prisma } from '../../database/prisma/prisma-client'
import { type PrismaRepositoryClient } from '../../database/prisma/prisma-repository-client'
import { PrismaTransactionManager } from '../../database/prisma/prisma-transaction-manager'
import { PrismaCartRepository } from '../../repositories/prisma-cart-repository'
import { PrismaProductRepository } from '../../repositories/prisma-product-repository'
import { CartController } from '../controllers/cart-controller'

export function makeCartController(): CartController {
    const transactionManager = new PrismaTransactionManager()
    const cartRepository = new PrismaCartRepository(prisma)
    const cartRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaCartRepository(tx as PrismaRepositoryClient)
    }
    const productRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaProductRepository(tx as PrismaRepositoryClient)
    }

    return new CartController({
        addItemToCart: new AddItemToCartUseCase(transactionManager, cartRepositoryFactory, productRepositoryFactory),
        removeItemFromCart: new RemoveItemFromCartUseCase(transactionManager, cartRepositoryFactory),
        getCart: new GetCartUseCase(cartRepository),
        clearCart: new ClearCartUseCase(cartRepository),
    })
}
