import { describe, expect, it, vi } from 'vitest'
import { UpdateProductUseCase } from '../../../../src/application/use-cases/product/update-product'
import { Product } from '../../../../src/domain/entities/product'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'

function makeSut() {
    const productRepository: ProductRepository = {
        create: vi.fn(),
        findById: vi.fn(),
        findExactMatch: vi.fn(),
        findByName: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(async product => product),
        delete: vi.fn(),
        decreaseStock: vi.fn(),
    }
    const updateProductUseCase = new UpdateProductUseCase(productRepository)

    return {
        productRepository,
        updateProductUseCase,
    }
}

describe('UpdateProductUseCase', () => {
    it('should update an existing product', async () => {
        const { productRepository, updateProductUseCase } = makeSut()
        const existingProduct = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findById).mockResolvedValue(existingProduct)

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
        expect(productRepository.findById).toHaveBeenCalledWith('product-1')
        expect(productRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            id: 'product-1',
            name: 'Mouse',
            price: 120,
        }))
    })

    it('should throw when product does not exist', async () => {
        const { productRepository, updateProductUseCase } = makeSut()
        vi.mocked(productRepository.findById).mockResolvedValue(null)

        await expect(updateProductUseCase.execute({
            id: 'missing-product',
            name: 'Mouse',
        })).rejects.toMatchObject({
            message: 'Produto nao encontrado.',
            statusCode: 400,
        })
        expect(productRepository.update).not.toHaveBeenCalled()
    })

    it('should throw when update data makes product invalid', async () => {
        const { productRepository, updateProductUseCase } = makeSut()
        const existingProduct = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findById).mockResolvedValue(existingProduct)

        await expect(updateProductUseCase.execute({
            id: 'product-1',
            price: 0,
        })).rejects.toMatchObject({
            message: 'Preco deve ser maior que zero.',
            statusCode: 400,
        })
        expect(productRepository.update).not.toHaveBeenCalled()
    })
})
