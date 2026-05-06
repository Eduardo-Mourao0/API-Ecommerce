import { ITransactionManager, PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaTransactionManager } from '../../infra/database/prisma/prisma-transaction-manager'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { CreateProductUseCase } from '../use-cases/product/create-product'
import { DeleteProductUseCase } from '../use-cases/product/delete-product'
import { GetAllProductsUseCase } from '../use-cases/product/get-all-products'
import { GetProductByNameUseCase } from '../use-cases/product/get-product-by-name'
import { UpdateProductUseCase } from '../use-cases/product/update-product'

export function makeProductUseCases(
    transactionManager: ITransactionManager = new PrismaTransactionManager()
) {
    const productRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaProductRepository(tx)

    return {
        createProduct: new CreateProductUseCase(transactionManager, productRepositoryFactory),
        getAllProducts: new GetAllProductsUseCase(transactionManager, productRepositoryFactory),
        getProductByName: new GetProductByNameUseCase(transactionManager, productRepositoryFactory),
        updateProduct: new UpdateProductUseCase(transactionManager, productRepositoryFactory),
        deleteProduct: new DeleteProductUseCase(transactionManager, productRepositoryFactory),
    }
}

export type ProductUseCases = ReturnType<typeof makeProductUseCases>
