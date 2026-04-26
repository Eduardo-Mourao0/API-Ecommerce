import { Cart } from '../../../domain/entities/cart'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface GetCartRequest {
    userId: string
}

export class GetCartUseCase {
    constructor(private cartRepository: CartRepository) {}

    async execute(request: GetCartRequest): Promise<Cart> {
        const cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart) {
            throw new BusinessError('Você não possui um carrinho.')
        }

        return cart
    }
}