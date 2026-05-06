import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface DeleteProductRequest {
    id: string
}

type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class DeleteProductUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: DeleteProductRequest): Promise<void> {
        await this.transactionManager.execute(async (tx) => {
            const productRepository = this.productRepositoryFactory(tx)
            const product = await productRepository.findById(request.id)

            if (!product) {
                throw new BusinessError('Produto n\u00e3o encontrado.')
            }

            await productRepository.delete(request.id)
        })
    }
}
