import { ProductDTO, toProductDTO } from '../../dtos/product-dto'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { ProductRepository } from '../../../domain/repositories/product-repository'

type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class GetAllProductsUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(): Promise<ProductDTO[]> {
        return await this.transactionManager.execute(async (tx) => {
            const productRepository = this.productRepositoryFactory(tx)
            const products = await productRepository.findAll()

            return products.map(toProductDTO)
        })
    }
}
