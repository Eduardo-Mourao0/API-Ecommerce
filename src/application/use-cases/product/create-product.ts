import { Product } from "../../../domain/entities/product"
import { ProductRepository } from "../../../domain/repositories/product-repository"

interface CreateProductRequest {
    name: string
    description: string
    price: number
    stock: number
}

export class CreateProductUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(request: CreateProductRequest): Promise<Product> {
        const product = Product.create(request)
        return await this.productRepository.create(product)
    }
}