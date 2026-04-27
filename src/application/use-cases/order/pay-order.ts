import { Order } from '../../../domain/entities/order'
import { IOrderRepository } from '../../../domain/repositories/order-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface PayOrderRequest {
    orderId: string
}

export class PayOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(request: PayOrderRequest): Promise<Order> {
        const order = await this.orderRepository.findById(request.orderId)

        if (!order) {
            throw new BusinessError('Pedido não encontrado.')
        }

        order.pay()

        return await this.orderRepository.update(order)
    }
}