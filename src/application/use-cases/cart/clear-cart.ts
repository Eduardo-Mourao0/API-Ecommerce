import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'

interface ClearCartRequest {
    userId: string
}

type CartRepositoryFactory = (tx: PrismaTransactionClient) => CartRepository

export class ClearCartUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private cartRepositoryFactory: CartRepositoryFactory
    ) {}

    async execute(request: ClearCartRequest): Promise<void> {
        await this.transactionManager.execute(async (tx) => {
            const cartRepository = this.cartRepositoryFactory(tx)
            const cart = await cartRepository.findByUserId(request.userId)

            if (!cart) {
                throw new BusinessError('Voc\u00ea n\u00e3o possui um carrinho.')
            }

            cart.clear()

            await cartRepository.clear(cart.id)
        })
    }
}
