import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface GetUserOrdersRequest {
    userId: string
}

export class GetUserOrdersUseCase {
    constructor(private orderRepository: IOrderRepository) {}

    async execute(request: GetUserOrdersRequest): Promise<OrderDTO[]> {
        const orders = await this.orderRepository.findByUserId(request.userId)

        if (orders.length === 0) {
            throw new BusinessError('Voce nao possui pedidos.')
        }

        return orders.map(toOrderDTO)
    }
}
