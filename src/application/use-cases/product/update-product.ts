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
            throw new BusinessError('Produto nao encontrado.')
        }

        product.update({
            name: request.name,
            description: request.description,
            price: request.price,
            stock: request.stock,
        })

        const updatedProduct = await this.productRepository.update(product)

        return toProductDTO(updatedProduct)
    }
}
