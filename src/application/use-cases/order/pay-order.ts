import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface PayOrderRequest {
    orderId: string
}

type OrderRepositoryFactory = (tx: PrismaTransactionClient) => IOrderRepository

export class PayOrderUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private orderRepositoryFactory: OrderRepositoryFactory
    ) {}

    async execute(request: PayOrderRequest): Promise<OrderDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const orderRepository = this.orderRepositoryFactory(tx)
            const order = await orderRepository.findById(request.orderId)

            if (!order) {
                throw new BusinessError('Pedido n\u00e3o encontrado.')
            }

            order.pay()

            const updatedOrder = await orderRepository.update(order)

            return toOrderDTO(updatedOrder)
        })
    }
}
