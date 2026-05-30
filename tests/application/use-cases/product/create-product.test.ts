import { describe, expect, it, vi } from 'vitest'
import { CreateProductUseCase } from '../../../../src/application/use-cases/product/create-product'
import { Product } from '../../../../src/domain/entities/product'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'

function makeSut() {
    const productRepository: ProductRepository = {
        create: vi.fn(async product => product),
        findById: vi.fn(),
        findExactMatch: vi.fn(),
        findByName: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(async product => product),
        delete: vi.fn(),
        decreaseStock: vi.fn(),
    }
    const createProductUseCase = new CreateProductUseCase(productRepository)

    return {
        productRepository,
        createProductUseCase,
    }
}

describe('CreateProductUseCase', () => {
    it('should create a product when there is no exact match', async () => {
        const { productRepository, createProductUseCase } = makeSut()
        vi.mocked(productRepository.findExactMatch).mockResolvedValue(null)

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
        expect(productRepository.findExactMatch).toHaveBeenCalledWith(expect.objectContaining({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
        }))
        expect(productRepository.create).toHaveBeenCalledTimes(1)
        expect(productRepository.update).not.toHaveBeenCalled()
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
        vi.mocked(productRepository.findExactMatch).mockResolvedValue(existingProduct)

        const product = await createProductUseCase.execute({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 5,
        })

        expect(product.id).toBe('product-1')
        expect(product.stock).toBe(15)
        expect(productRepository.update).toHaveBeenCalledWith(expect.objectContaining({
            id: 'product-1',
            stock: 15,
        }))
        expect(productRepository.create).not.toHaveBeenCalled()
    })

    it('should throw BusinessError when price is less than or equal to zero', async () => {
        const { productRepository, createProductUseCase } = makeSut()

        await expect(createProductUseCase.execute({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 0,
            stock: 10,
        })).rejects.toMatchObject({
            message: 'Preco deve ser maior que zero.',
            statusCode: 400,
        })
        expect(productRepository.findExactMatch).not.toHaveBeenCalled()
        expect(productRepository.create).not.toHaveBeenCalled()
    })
})
