import { describe, expect, it } from 'vitest'
import { AddItemToCartUseCase } from '../../../../src/application/use-cases/cart/add-item-to-cart'
import { Product } from '../../../../src/domain/entities/product'
import { FakeCartRepository } from '../../../fakes/fake-cart-repository'
import { FakeProductRepository } from '../../../fakes/fake-product-repository'
import { FakeTransactionManager } from '../../../fakes/fake-transaction-manager'

function makeSut() {
    const cartRepository = new FakeCartRepository()
    const productRepository = new FakeProductRepository()
    const transactionManager = new FakeTransactionManager()
    const addItemToCartUseCase = new AddItemToCartUseCase(
        transactionManager,
        () => cartRepository,
        () => productRepository
    )

    return {
        cartRepository,
        productRepository,
        addItemToCartUseCase,
    }
}

describe('AddItemToCartUseCase', () => {
    it('should create a cart and add product when user has no cart', async () => {
        const { cartRepository, productRepository, addItemToCartUseCase } = makeSut()
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        }))

        const cart = await addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'product-1',
            quantity: 2,
        })

        expect(cart.userId).toBe('user-1')
        expect(cart.items).toHaveLength(1)
        expect(cart.items[0].productId).toBe('product-1')
        expect(cart.items[0].quantity).toBe(2)
        expect(cartRepository.carts).toHaveLength(1)
    })

    it('should throw when product does not exist', async () => {
        const { addItemToCartUseCase } = makeSut()

        await expect(addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'missing-product',
            quantity: 1,
        })).rejects.toMatchObject({
            message: 'Produto não encontrado.',
            statusCode: 400,
        })
    })

    it('should throw when requested quantity exceeds stock', async () => {
        const { productRepository, addItemToCartUseCase } = makeSut()
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 1,
        }))

        await expect(addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'product-1',
            quantity: 2,
        })).rejects.toMatchObject({
            message: 'Quantidade solicitada excede o estoque disponível.',
            statusCode: 400,
        })
    })
})
