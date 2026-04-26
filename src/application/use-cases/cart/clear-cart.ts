import { CartRepository } from '../../../domain/repositories/cart-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface ClearCartRequest {
    userId: string
}

export class ClearCartUseCase {
    constructor(private cartRepository: CartRepository) {}

    async execute(request: ClearCartRequest): Promise<void> {
        const cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart) {
            throw new BusinessError('Você não possui um carrinho.')
        }

        cart.clear()

        await this.cartRepository.clear(cart.id)
    }
}