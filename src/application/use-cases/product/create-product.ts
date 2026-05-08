import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { Product } from '../../../domain/entities/product'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface CreateProductRequest {
    name: string
    description: string
    price: number
    stock: number
}

type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class CreateProductUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: CreateProductRequest): Promise<ProductDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const productRepository = this.productRepositoryFactory(tx)
            const product = Product.create(request)
            const existingProduct = await productRepository.findExactMatch(product)

            if (existingProduct) {
                existingProduct.stock += product.stock

                const updatedProduct = await productRepository.update(existingProduct)

                return toProductDTO(updatedProduct)
            }

            const createdProduct = await productRepository.create(product)

            return toProductDTO(createdProduct)
        })
    }
}
