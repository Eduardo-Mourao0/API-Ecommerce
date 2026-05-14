import { type NextFunction, type Request, type Response } from 'express'
import { type CancelOrderUseCase } from '../../../application/use-cases/order/cancel-order'
import { type CreateOrderUseCase } from '../../../application/use-cases/order/create-order'
import { type GetUserOrdersUseCase } from '../../../application/use-cases/order/get-all-order'
import { type PayOrderUseCase } from '../../../application/use-cases/order/pay-order'
import { getAuthenticatedUserId } from './http-auth'
import { getRouteParam } from './http-params'

export interface OrderUseCases {
    createOrder: CreateOrderUseCase
    getUserOrders: GetUserOrdersUseCase
    cancelOrder: CancelOrderUseCase
    payOrder: PayOrderUseCase
}

export class OrderController {
    constructor(private readonly orderUseCases: OrderUseCases) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)
            const order = await this.orderUseCases.createOrder.execute({ userId })

            res.status(201).json(order)
        } catch (error) {
            next(error)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)
            const orders = await this.orderUseCases.getUserOrders.execute({ userId })

            res.status(200).json(orders)
        } catch (error) {
            next(error)
        }
    }

    async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const order = await this.orderUseCases.cancelOrder.execute({
                orderId: getRouteParam(req, 'orderId', 'id'),
            })

            res.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }

    async pay(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const order = await this.orderUseCases.payOrder.execute({
                orderId: getRouteParam(req, 'orderId', 'id'),
            })

            res.status(200).json(order)
        } catch (error) {
            next(error)
        }
    }
}
