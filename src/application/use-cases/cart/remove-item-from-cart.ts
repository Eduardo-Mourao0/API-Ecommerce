import { CartDTO, toCartDTO } from '../../dtos/cart-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, TransactionContext } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'

interface RemoveItemFromCartRequest {
    userId: string
    cartItemId: string
}

type CartRepositoryFactory = (tx: TransactionContext) => CartRepository

export class RemoveItemFromCartUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private cartRepositoryFactory: CartRepositoryFactory
    ) {}

    async execute(request: RemoveItemFromCartRequest): Promise<CartDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const cartRepository = this.cartRepositoryFactory(tx)
            const cart = await cartRepository.findByUserId(request.userId)

            if (!cart) {
                throw new BusinessError('Você não possui um carrinho.')
            }

            const item = cart.items.find(i => i.id === request.cartItemId)

            if (!item) {
                throw new BusinessError('Item nao encontrado no carrinho.')
            }

            cart.removeItem(request.cartItemId)

            const updatedCart = await cartRepository.update(cart)

            return toCartDTO(updatedCart)
        })
    }
}
