import { type NextFunction, type Request, type Response } from 'express'
import { type CreateProductUseCase } from '../../../application/use-cases/product/create-product'
import { type DeleteProductUseCase } from '../../../application/use-cases/product/delete-product'
import { type GetAllProductsUseCase } from '../../../application/use-cases/product/get-all-products'
import { type GetProductByNameUseCase } from '../../../application/use-cases/product/get-product-by-name'
import { type UpdateProductUseCase } from '../../../application/use-cases/product/update-product'
import { getRouteParam } from './http-params'

function getProductName(req: Request): string {
    const name = req.params.name ?? req.query.name ?? ''

    return String(name)
}

export interface ProductUseCases {
    createProduct: CreateProductUseCase
    getAllProducts: GetAllProductsUseCase
    getProductByName: GetProductByNameUseCase
    updateProduct: UpdateProductUseCase
    deleteProduct: DeleteProductUseCase
}

export class ProductController {
    constructor(private readonly productUseCases: ProductUseCases) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.productUseCases.createProduct.execute(req.body)

            res.status(201).json(product)
        } catch (error) {
            next(error)
        }
    }

    async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.productUseCases.getAllProducts.execute()

            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    async getByName(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const products = await this.productUseCases.getProductByName.execute({
                name: getProductName(req),
            })

            res.status(200).json(products)
        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const product = await this.productUseCases.updateProduct.execute({
                ...req.body,
                id: getRouteParam(req, 'id'),
            })

            res.status(200).json(product)
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.productUseCases.deleteProduct.execute({ id: getRouteParam(req, 'id') })

            res.status(200).json({
                message: 'Produto deletado com sucesso.',
            })
        } catch (error) {
            next(error)
        }
    }
}
