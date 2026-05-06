import { type NextFunction, type Request, type Response } from 'express'
import { type CartUseCases } from '../../../application/factories/make-cart-use-cases'
import { getAuthenticatedUserId } from './http-auth'
import { getRouteParam } from './http-params'

export class CartController {
    constructor(private readonly cartUseCases: CartUseCases) {}

    async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)
            const { productId, quantity } = req.body
            const cart = await this.cartUseCases.addItemToCart.execute({
                userId,
                productId,
                quantity,
            })

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)
            const cart = await this.cartUseCases.removeItemFromCart.execute({
                userId,
                cartItemId: getRouteParam(req, 'cartItemId', 'id'),
            })

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async get(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)
            const cart = await this.cartUseCases.getCart.execute({ userId })

            res.status(200).json(cart)
        } catch (error) {
            next(error)
        }
    }

    async clear(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)

            await this.cartUseCases.clearCart.execute({ userId })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
