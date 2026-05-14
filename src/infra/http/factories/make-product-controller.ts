import { CreateProductUseCase } from '../../../application/use-cases/product/create-product'
import { DeleteProductUseCase } from '../../../application/use-cases/product/delete-product'
import { GetAllProductsUseCase } from '../../../application/use-cases/product/get-all-products'
import { GetProductByNameUseCase } from '../../../application/use-cases/product/get-product-by-name'
import { UpdateProductUseCase } from '../../../application/use-cases/product/update-product'
import { prisma } from '../../database/prisma/prisma-client'
import { PrismaProductRepository } from '../../repositories/prisma-product-repository'
import { ProductController } from '../controllers/product-controller'

export function makeProductController(): ProductController {
    const productRepository = new PrismaProductRepository(prisma)

    return new ProductController({
        createProduct: new CreateProductUseCase(productRepository),
        getAllProducts: new GetAllProductsUseCase(productRepository),
        getProductByName: new GetProductByNameUseCase(productRepository),
        updateProduct: new UpdateProductUseCase(productRepository),
        deleteProduct: new DeleteProductUseCase(productRepository),
    })
}
