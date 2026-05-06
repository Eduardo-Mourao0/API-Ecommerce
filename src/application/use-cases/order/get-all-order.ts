import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { IOrderRepository } from '../../../domain/repositories/order-repository'

interface GetUserOrdersRequest {
    userId: string
}

type OrderRepositoryFactory = (tx: PrismaTransactionClient) => IOrderRepository

export class GetUserOrdersUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private orderRepositoryFactory: OrderRepositoryFactory
    ) {}

    async execute(request: GetUserOrdersRequest): Promise<OrderDTO[]> {
        return await this.transactionManager.execute(async (tx) => {
            const orderRepository = this.orderRepositoryFactory(tx)
            const orders = await orderRepository.findByUserId(request.userId)

            if (orders.length === 0) {
                throw new BusinessError('Voc\u00ea n\u00e3o possui pedidos.')
            }

            return orders.map(toOrderDTO)
        })
    }
}
