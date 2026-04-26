import { Product } from '../../../domain/entities/product'
import { ProductRepository } from '../../../domain/repositories/product-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface UpdateProductRequest {
    id: string
    name?: string
    description?: string
    price?: number
    stock?: number
}

export class UpdateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: UpdateProductRequest): Promise<Product> {
        const product = await this.productRepository.findById(request.id)

        if (!product) {
        throw new BusinessError('Produto não encontrado.')
        }

        if (request.name) product.name = request.name
        if (request.description) product.description = request.description
        if (request.price) product.price = request.price
        if (request.stock !== undefined) product.stock = request.stock

        return await this.productRepository.update(product)
    }
}