import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaProductRepository } from '../../infra/repositories/prisma-product-repository'
import { CreateProductUseCase } from '../use-cases/product/create-product'
import { GetAllProductsUseCase } from '../use-cases/product/get-all-products'
import { GetProductByNameUseCase } from '../use-cases/product/get-product-by-name'
import { UpdateProductUseCase } from '../use-cases/product/update-product'
import { DeleteProductUseCase } from '../use-cases/product/delete-product'

export function makeProductUseCases(tx: PrismaTransactionClient) {
    const productRepository = new PrismaProductRepository(tx)

    return {
        createProduct: new CreateProductUseCase(productRepository),
        getAllProducts: new GetAllProductsUseCase(productRepository),
        getProductByName: new GetProductByNameUseCase(productRepository),
        updateProduct: new UpdateProductUseCase(productRepository),
        deleteProduct: new DeleteProductUseCase(productRepository),
    }
}
