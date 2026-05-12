import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface PayOrderRequest {
    orderId: string
}

export class PayOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(request: PayOrderRequest): Promise<OrderDTO> {
        const order = await this.orderRepository.findById(request.orderId)

        if (!order) {
            throw new BusinessError('Pedido nao encontrado.')
        }

        order.pay()

        const updatedOrder = await this.orderRepository.update(order)

        return toOrderDTO(updatedOrder)
    }
}
