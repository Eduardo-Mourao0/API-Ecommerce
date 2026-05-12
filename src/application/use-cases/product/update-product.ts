import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface UpdateProductRequest {
    id: string
    name?: string
    description?: string
    price?: number
    stock?: number
}

export class UpdateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: UpdateProductRequest): Promise<ProductDTO> {
        const product = await this.productRepository.findById(request.id)

        if (!product) {
            throw new BusinessError('Produto n\u00e3o encontrado.')
        }

        if (request.name) product.name = request.name
        if (request.description) product.description = request.description
        if (request.price) product.price = request.price
        if (request.stock !== undefined) product.stock = request.stock

        const updatedProduct = await this.productRepository.update(product)

        return toProductDTO(updatedProduct)
    }
}
