import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface UpdateProductRequest {
    id: string
    name?: string
    description?: string
    price?: number
    stock?: number
}

type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class UpdateProductUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: UpdateProductRequest): Promise<ProductDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const productRepository = this.productRepositoryFactory(tx)
            const product = await productRepository.findById(request.id)

            if (!product) {
                throw new BusinessError('Produto n\u00e3o encontrado.')
            }

            if (request.name) product.name = request.name
            if (request.description) product.description = request.description
            if (request.price) product.price = request.price
            if (request.stock !== undefined) product.stock = request.stock

            const updatedProduct = await productRepository.update(product)

            return toProductDTO(updatedProduct)
        })
    }
}
