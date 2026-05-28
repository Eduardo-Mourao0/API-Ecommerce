import { describe, expect, it } from 'vitest'
import { CreateProductUseCase } from '../../../../src/application/use-cases/product/create-product'
import { Product } from '../../../../src/domain/entities/product'
import { FakeProductRepository } from '../../../fakes/fake-product-repository'

function makeSut() {
    const productRepository = new FakeProductRepository()
    const createProductUseCase = new CreateProductUseCase(productRepository)

    return {
        productRepository,
        createProductUseCase,
    }
}

describe('CreateProductUseCase', () => {
    it('should create a product when there is no exact match', async () => {
        const { productRepository, createProductUseCase } = makeSut()

        const product = await createProductUseCase.execute({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })

        expect(product).toHaveProperty('id')
        expect(product.name).toBe('Keyboard')
        expect(product.description).toBe('Mechanical keyboard')
        expect(product.price).toBe(250)
        expect(product.stock).toBe(10)
        expect(productRepository.products).toHaveLength(1)
    })

    it('should increase stock when an exact product already exists', async () => {
        const { productRepository, createProductUseCase } = makeSut()

        const existingProduct = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        productRepository.products.push(existingProduct)

        const product = await createProductUseCase.execute({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 5,
        })

        expect(product.id).toBe('product-1')
        expect(product.stock).toBe(15)
        expect(productRepository.products).toHaveLength(1)
        expect(productRepository.products[0].stock).toBe(15)
    })

    it('should throw BusinessError when price is less than or equal to zero', async () => {
        const { createProductUseCase } = makeSut()

        await expect(createProductUseCase.execute({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 0,
            stock: 10,
        })).rejects.toMatchObject({
            message: 'Preco deve ser maior que zero.',
            statusCode: 400,
        })
    })
})
