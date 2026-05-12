import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface CancelOrderRequest {
    orderId: string
}

export class CancelOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(request: CancelOrderRequest): Promise<OrderDTO> {
        const order = await this.orderRepository.findById(request.orderId)

        if (!order) {
            throw new BusinessError('Pedido nao encontrado.')
        }

        order.cancel()

        const updatedOrder = await this.orderRepository.update(order)

        return toOrderDTO(updatedOrder)
    }
}
