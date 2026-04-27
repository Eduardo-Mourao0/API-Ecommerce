import { Order } from '../../../domain/entities/order'
import { IOrderRepository } from '../../../domain/repositories/order-repository' 
import { BusinessError } from '../../../domain/errors/business-error'

interface GetUserOrdersRequest {
    userId: string
}

export class GetUserOrdersUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(request: GetUserOrdersRequest): Promise<Order[]> {
        
        const orders = await this.orderRepository.findByUserId(request.userId)

        if (orders.length === 0) {
            throw new BusinessError('Você não possui pedidos.')
        }

        return orders
    }
}