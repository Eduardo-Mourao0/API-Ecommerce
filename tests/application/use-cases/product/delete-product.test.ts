import { describe, expect, it, vi } from 'vitest'
import { DeleteProductUseCase } from '../../../../src/application/use-cases/product/delete-product'
import { Product } from '../../../../src/domain/entities/product'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'

function makeSut() {
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
    const deleteProductUseCase = new DeleteProductUseCase(productRepository)

    return {
        productRepository,
        deleteProductUseCase,
    }
}

describe('DeleteProductUseCase', () => {
    it('should delete an existing product', async () => {
        const { productRepository, deleteProductUseCase } = makeSut()
        const product = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findById).mockResolvedValue(product)

        await deleteProductUseCase.execute({ id: 'product-1' })

        expect(productRepository.findById).toHaveBeenCalledWith('product-1')
        expect(productRepository.delete).toHaveBeenCalledWith('product-1')
    })

    it('should throw when product does not exist', async () => {
        const { productRepository, deleteProductUseCase } = makeSut()
        vi.mocked(productRepository.findById).mockResolvedValue(null)

        await expect(deleteProductUseCase.execute({ id: 'missing-product' }))
            .rejects.toMatchObject({
                message: 'Produto nao encontrado.',
                statusCode: 400,
            })
        expect(productRepository.delete).not.toHaveBeenCalled()
    })
})
