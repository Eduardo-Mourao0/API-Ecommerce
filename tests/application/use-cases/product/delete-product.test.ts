import { describe, expect, it } from 'vitest'
import { DeleteProductUseCase } from '../../../../src/application/use-cases/product/delete-product'
import { Product } from '../../../../src/domain/entities/product'
import { FakeProductRepository } from '../../../fakes/fake-product-repository'

describe('DeleteProductUseCase', () => {
    it('should delete an existing product', async () => {
        const productRepository = new FakeProductRepository()
        const deleteProductUseCase = new DeleteProductUseCase(productRepository)
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        }))

        await deleteProductUseCase.execute({ id: 'product-1' })

        expect(productRepository.products).toHaveLength(0)
    })

    it('should throw when product does not exist', async () => {
        const productRepository = new FakeProductRepository()
        const deleteProductUseCase = new DeleteProductUseCase(productRepository)

        await expect(deleteProductUseCase.execute({ id: 'missing-product' }))
            .rejects.toMatchObject({
                message: 'Produto nao encontrado.',
                statusCode: 400,
            })
    })
})
