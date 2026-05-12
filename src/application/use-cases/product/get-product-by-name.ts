import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface GetProductByNameRequest {
    name: string
}

export class GetProductByNameUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: GetProductByNameRequest): Promise<ProductDTO[]> {
        const products = await this.productRepository.findByName(request.name)

        if (products.length === 0) {
            throw new BusinessError('Nenhum produto encontrado.', 404)
        }

        return products.map(toProductDTO)
    }
}
