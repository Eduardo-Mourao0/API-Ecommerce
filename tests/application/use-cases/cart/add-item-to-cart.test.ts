import { describe, expect, it, vi } from 'vitest'
import { AddItemToCartUseCase } from '../../../../src/application/use-cases/cart/add-item-to-cart'
import { Product } from '../../../../src/domain/entities/product'
import { CartRepository } from '../../../../src/domain/repositories/cart-repository'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'
import { ITransactionManager } from '../../../../src/domain/managers/ITransactionManager'

function makeSut() {
    const cartRepository: CartRepository = {
        create: vi.fn(async cart => cart),
        findByUserId: vi.fn(),
        update: vi.fn(async cart => cart),
        clear: vi.fn(),
    }
    const productRepository: ProductRepository = {
        create: vi.fn(),
        findById: vi.fn(),
        findExactMatch: vi.fn(),
        findByName: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        decreaseStock: vi.fn(),
    }
    const transactionManager: ITransactionManager = {
        execute: vi.fn(action => action({})),
    }
    const addItemToCartUseCase = new AddItemToCartUseCase(
        transactionManager,
        () => cartRepository,
        () => productRepository
    )

    return {
        cartRepository,
        productRepository,
        transactionManager,
        addItemToCartUseCase,
    }
}

describe('AddItemToCartUseCase', () => {
    it('should create a cart and add product when user has no cart', async () => {
        const { cartRepository, productRepository, transactionManager, addItemToCartUseCase } = makeSut()
        const product = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findById).mockResolvedValue(product)
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(null)

        const cart = await addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'product-1',
            quantity: 2,
        })

        expect(cart.userId).toBe('user-1')
        expect(cart.items).toHaveLength(1)
        expect(cart.items[0].productId).toBe('product-1')
        expect(cart.items[0].quantity).toBe(2)
        expect(transactionManager.execute).toHaveBeenCalledTimes(1)
        expect(cartRepository.create).toHaveBeenCalledTimes(1)
        expect(cartRepository.update).toHaveBeenCalledTimes(1)
    })

    it('should throw when product does not exist', async () => {
        const { productRepository, cartRepository, addItemToCartUseCase } = makeSut()
        vi.mocked(productRepository.findById).mockResolvedValue(null)

        await expect(addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'missing-product',
            quantity: 1,
        })).rejects.toMatchObject({
            message: 'Produto não encontrado.',
            statusCode: 400,
        })
        expect(cartRepository.create).not.toHaveBeenCalled()
        expect(cartRepository.update).not.toHaveBeenCalled()
    })

    it('should throw when requested quantity exceeds stock', async () => {
        const { productRepository, cartRepository, addItemToCartUseCase } = makeSut()
        const product = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 1,
        })
        vi.mocked(productRepository.findById).mockResolvedValue(product)

        await expect(addItemToCartUseCase.execute({
            userId: 'user-1',
            productId: 'product-1',
            quantity: 2,
        })).rejects.toMatchObject({
            message: 'Quantidade solicitada excede o estoque disponível.',
            statusCode: 400,
        })
        expect(cartRepository.create).not.toHaveBeenCalled()
        expect(cartRepository.update).not.toHaveBeenCalled()
    })
})
