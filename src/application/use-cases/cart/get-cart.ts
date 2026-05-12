import { CartDTO, toCartDTO } from '../../dtos/cart-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { CartRepository } from '../../../domain/repositories/cart-repository'

interface GetCartRequest {
    userId: string
}

export class GetCartUseCase {
    constructor(private cartRepository: CartRepository) {}

    async execute(request: GetCartRequest): Promise<CartDTO> {
        const cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart) {
            throw new BusinessError('Voce nao possui um carrinho.')
        }

        return toCartDTO(cart)
    }
}
