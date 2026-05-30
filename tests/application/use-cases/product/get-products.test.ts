import { describe, expect, it, vi } from 'vitest'
import { GetAllProductsUseCase } from '../../../../src/application/use-cases/product/get-all-products'
import { GetProductByNameUseCase } from '../../../../src/application/use-cases/product/get-product-by-name'
import { Product } from '../../../../src/domain/entities/product'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'

function makeRepository(): ProductRepository {
    return {
        create: vi.fn(),
        findById: vi.fn(),
        findExactMatch: vi.fn(),
        findByName: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        decreaseStock: vi.fn(),
    }
}

describe('Product read use cases', () => {
    it('should return all products', async () => {
        const productRepository = makeRepository()
        const getAllProductsUseCase = new GetAllProductsUseCase(productRepository)
        const product = Product.create({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findAll).mockResolvedValue([product])

        const products = await getAllProductsUseCase.execute()

        expect(products).toHaveLength(1)
        expect(products[0]).toHaveProperty('name', 'Keyboard')
        expect(productRepository.findAll).toHaveBeenCalledTimes(1)
    })

    it('should return products by name', async () => {
        const productRepository = makeRepository()
        const getProductByNameUseCase = new GetProductByNameUseCase(productRepository)
        const product = Product.create({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(productRepository.findByName).mockResolvedValue([product])

        const products = await getProductByNameUseCase.execute({ name: 'key' })

        expect(products).toHaveLength(1)
        expect(products[0]).toHaveProperty('name', 'Keyboard')
        expect(productRepository.findByName).toHaveBeenCalledWith('key')
    })

    it('should throw when no product is found by name', async () => {
        const productRepository = makeRepository()
        const getProductByNameUseCase = new GetProductByNameUseCase(productRepository)
        vi.mocked(productRepository.findByName).mockResolvedValue([])

        await expect(getProductByNameUseCase.execute({ name: 'missing' }))
            .rejects.toMatchObject({
                message: 'Nenhum produto encontrado.',
                statusCode: 404,
            })
    })
})
