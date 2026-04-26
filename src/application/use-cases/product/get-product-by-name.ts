import { Product } from "../../../domain/entities/product"
import { ProductRepository } from '../../../domain/repositories/product-repository'
import { BusinessError } from "../../../domain/errors/business-error"

interface GetProductByNameRequest {
    name: string
}

export class GetProductByNameUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: GetProductByNameRequest): Promise<Product[]> {
        const products = await this.productRepository.findByName(request.name)

        if (products.length === 0) {
            throw new BusinessError('Nenhum produto encontrado.', 404)
        }

        return products
    }
}
