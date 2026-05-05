import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaCartRepository } from '../../infra/repositories/prisma-cart-repository'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { AddItemToCartUseCase } from '../use-cases/cart/add-item-to-cart'
import { RemoveItemFromCartUseCase } from '../use-cases/cart/remove-item-from-cart'
import { GetCartUseCase } from '../use-cases/cart/get-cart'
import { ClearCartUseCase } from '../use-cases/cart/clear-cart'

export function makeCartUseCases(tx: PrismaTransactionClient) {
    const cartRepository = new PrismaCartRepository(tx)
    const productRepository = new PrismaProductRepository(tx)

    return {
        addItemToCart: new AddItemToCartUseCase(cartRepository, productRepository),
        removeItemFromCart: new RemoveItemFromCartUseCase(cartRepository),
        getCart: new GetCartUseCase(cartRepository),
        clearCart: new ClearCartUseCase(cartRepository),
    }
}
