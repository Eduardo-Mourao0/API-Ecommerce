import { describe, expect, it, vi } from 'vitest'
import { ClearCartUseCase } from '../../../../src/application/use-cases/cart/clear-cart'
import { GetCartUseCase } from '../../../../src/application/use-cases/cart/get-cart'
import { RemoveItemFromCartUseCase } from '../../../../src/application/use-cases/cart/remove-item-from-cart'
import { Cart } from '../../../../src/domain/entities/cart'
import { CartItem } from '../../../../src/domain/entities/cart-item'
import { CartRepository } from '../../../../src/domain/repositories/cart-repository'
import { ITransactionManager } from '../../../../src/domain/managers/ITransactionManager'

function makeCartRepository(): CartRepository {
    return {
        create: vi.fn(),
        findByUserId: vi.fn(),
        update: vi.fn(async cart => cart),
        clear: vi.fn(),
    }
}

function makeTransactionManager(): ITransactionManager {
    return {
        execute: vi.fn(action => action({})),
    }
}

function makeCartWithItem() {
    const cart = Cart.create({ userId: 'user-1' })
    cart.addItem(CartItem.createFromPrimitives({
        id: 'item-1',
        cartId: cart.id,
        productId: 'product-1',
        quantity: 2,
        productName: 'Keyboard',
        productPrice: 250,
    }), 10)

    return cart
}

describe('Cart use cases', () => {
    it('should get user cart', async () => {
        const cartRepository = makeCartRepository()
        const getCartUseCase = new GetCartUseCase(cartRepository)
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(makeCartWithItem())

        const cart = await getCartUseCase.execute({ userId: 'user-1' })

        expect(cart.items).toHaveLength(1)
        expect(cart.total).toBe(500)
        expect(cartRepository.findByUserId).toHaveBeenCalledWith('user-1')
    })

    it('should throw when user has no cart', async () => {
        const cartRepository = makeCartRepository()
        const getCartUseCase = new GetCartUseCase(cartRepository)
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(null)

        await expect(getCartUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Voce nao possui um carrinho.',
                statusCode: 400,
            })
    })

    it('should remove item from cart', async () => {
        const cartRepository = makeCartRepository()
        const removeItemFromCartUseCase = new RemoveItemFromCartUseCase(
            makeTransactionManager(),
            () => cartRepository
        )
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(makeCartWithItem())

        const cart = await removeItemFromCartUseCase.execute({
            userId: 'user-1',
            cartItemId: 'item-1',
        })

        expect(cart.items).toHaveLength(0)
        expect(cartRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            userId: 'user-1',
            items: [],
        }))
    })

    it('should clear cart', async () => {
        const cartRepository = makeCartRepository()
        const clearCartUseCase = new ClearCartUseCase(cartRepository)
        const cart = makeCartWithItem()
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(cart)

        await clearCartUseCase.execute({ userId: 'user-1' })

        expect(cartRepository.clear).toHaveBeenCalledWith(cart.id)
    })
})
