import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface GetProductByNameRequest {
    name: string
}

type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class GetProductByNameUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: GetProductByNameRequest): Promise<ProductDTO[]> {
        return await this.transactionManager.execute(async (tx) => {
            const productRepository = this.productRepositoryFactory(tx)
            const products = await productRepository.findByName(request.name)

            if (products.length === 0) {
                throw new BusinessError('Nenhum produto encontrado.', 404)
            }

            return products.map(toProductDTO)
        })
    }
}
