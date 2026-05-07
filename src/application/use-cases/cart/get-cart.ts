import { CartDTO, toCartDTO } from '../../dtos/cart-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'

interface GetCartRequest {
    userId: string
}

type CartRepositoryFactory = (tx: PrismaTransactionClient) => CartRepository

export class GetCartUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private cartRepositoryFactory: CartRepositoryFactory
    ) {}

    async execute(request: GetCartRequest): Promise<CartDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const cartRepository = this.cartRepositoryFactory(tx)
            const cart = await cartRepository.findByUserId(request.userId)

            if (!cart) {
                throw new BusinessError('Você não possui um carrinho.')
            }

            return toCartDTO(cart)
        })
    }
}
