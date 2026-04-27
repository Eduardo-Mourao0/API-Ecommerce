import { IOrderRepository } from "../../../domain/repositories/order-repository"
import { BusinessError } from "../../../domain/errors/business-error"
import { Order } from "../../../domain/entities/order"

interface CancelOrderRequest {
    orderId: string
}

export class CancelOrderUseCase {
    constructor(private orderRepository: IOrderRepository) {}
    
    async execute(request: CancelOrderRequest): Promise<Order> {
        const order = await this.orderRepository.findById(request.orderId)
    
        if (!order) {
            throw new BusinessError('Pedido não encontrado.')
        }
    
        order.cancel()
    
        return await this.orderRepository.update(order)
    }
}