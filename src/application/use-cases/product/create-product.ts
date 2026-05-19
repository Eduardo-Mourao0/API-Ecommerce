import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { Product } from '../../../domain/entities/product'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface CreateProductRequest {
    name: string
    description: string
    price: number
    stock: number
}

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: CreateProductRequest): Promise<ProductDTO> {
        const product = Product.create(request)
        const existingProduct = await this.productRepository.findExactMatch(product)

        if (existingProduct) {
            existingProduct.update({
                stock: existingProduct.stock + product.stock,
            })

            const updatedProduct = await this.productRepository.update(existingProduct)

            return toProductDTO(updatedProduct)
        }

        const createdProduct = await this.productRepository.create(product)

        return toProductDTO(createdProduct)
    }
}
