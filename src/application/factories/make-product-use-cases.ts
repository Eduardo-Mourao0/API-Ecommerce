import { ITransactionManager, TransactionContext } from '../../domain/managers/ITransactionManager'
import { prisma } from '../../infra/database/prisma/prisma-client'
import { PrismaTransactionClient } from '../../infra/database/prisma/prisma-transaction-client'
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
    const productRepository = new PrismaProductRepository(prisma)
    const productRepositoryFactory = (tx: TransactionContext) => {
        return new PrismaProductRepository(tx as PrismaTransactionClient)
    }

    return {
        createProduct: new CreateProductUseCase(transactionManager, productRepositoryFactory),
        getAllProducts: new GetAllProductsUseCase(productRepository),
        getProductByName: new GetProductByNameUseCase(productRepository),
        updateProduct: new UpdateProductUseCase(productRepository),
        deleteProduct: new DeleteProductUseCase(productRepository),
    }
}

export type ProductUseCases = ReturnType<typeof makeProductUseCases>
