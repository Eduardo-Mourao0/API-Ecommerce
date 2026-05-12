import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { ProductRepository } from '../../../domain/repositories/product-repository'

export class GetAllProductsUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(): Promise<ProductDTO[]> {
        const products = await this.productRepository.findAll()

        return products.map(toProductDTO)
    }
}
