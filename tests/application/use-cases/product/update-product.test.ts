import { describe, expect, it } from 'vitest'
import { UpdateProductUseCase } from '../../../../src/application/use-cases/product/update-product'
import { Product } from '../../../../src/domain/entities/product'
import { FakeProductRepository } from '../../../fakes/fake-product-repository'

function makeSut() {
    const productRepository = new FakeProductRepository()
    const updateProductUseCase = new UpdateProductUseCase(productRepository)

    return {
        productRepository,
        updateProductUseCase,
    }
}

describe('UpdateProductUseCase', () => {
    it('should update an existing product', async () => {
        const { productRepository, updateProductUseCase } = makeSut()
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        }))

        const product = await updateProductUseCase.execute({
            id: 'product-1',
            name: 'Mouse',
            price: 120,
        })

        expect(product.id).toBe('product-1')
        expect(product.name).toBe('Mouse')
        expect(product.description).toBe('Mechanical keyboard')
        expect(product.price).toBe(120)
        expect(product.stock).toBe(10)
    })

    it('should throw when product does not exist', async () => {
        const { updateProductUseCase } = makeSut()

        await expect(updateProductUseCase.execute({
            id: 'missing-product',
            name: 'Mouse',
        })).rejects.toMatchObject({
            message: 'Produto nao encontrado.',
            statusCode: 400,
        })
    })

    it('should throw when update data makes product invalid', async () => {
        const { productRepository, updateProductUseCase } = makeSut()
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        }))

        await expect(updateProductUseCase.execute({
            id: 'product-1',
            price: 0,
        })).rejects.toMatchObject({
            message: 'Preco deve ser maior que zero.',
            statusCode: 400,
        })
    })
})
