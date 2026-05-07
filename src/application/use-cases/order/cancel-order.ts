import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface CancelOrderRequest {
    orderId: string
}

type OrderRepositoryFactory = (tx: PrismaTransactionClient) => IOrderRepository

export class CancelOrderUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private orderRepositoryFactory: OrderRepositoryFactory
    ) {}

    async execute(request: CancelOrderRequest): Promise<OrderDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const orderRepository = this.orderRepositoryFactory(tx)
            const order = await orderRepository.findById(request.orderId)

            if (!order) {
                throw new BusinessError('Pedido nao encontrado.')
            }

            order.cancel()

            const updatedOrder = await orderRepository.update(order)

            return toOrderDTO(updatedOrder)
        })
    }
}
