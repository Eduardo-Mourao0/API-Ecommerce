import { Cart } from '../../../domain/entities/cart'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface RemoveItemFromCartRequest {
    userId: string
    cartItemId: string
}

export class RemoveItemFromCartUseCase {
    constructor(private cartRepository: CartRepository) {}

    async execute(request: RemoveItemFromCartRequest): Promise<Cart> {
        const cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart) {
            throw new BusinessError('Você não possui um carrinho.')
        }

        const item = cart.items.find(i => i.id === request.cartItemId)

        if (!item) {
            throw new BusinessError('Item não encontrado no carrinho.')
        }

        cart.removeItem(request.cartItemId)

        return await this.cartRepository.update(cart)
    }
}