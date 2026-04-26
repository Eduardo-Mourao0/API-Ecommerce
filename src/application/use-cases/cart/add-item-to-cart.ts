import { CartRepository } from '../../../domain/repositories/cart-repository'
import { ProductRepository } from '../../../domain/repositories/product-repository'
import { CartItem } from '../../../domain/entities/cart-item'
import { Cart } from '../../../domain/entities/cart'
import { BusinessError } from '../../../domain/errors/business-error'

interface AddItemToCartRequest {
    userId: string
    productId: string
    quantity: number
}

export class AddItemToCartUseCase {
    constructor(
        private cartRepository: CartRepository,
        private productRepository: ProductRepository
    ) {}

    async execute(request: AddItemToCartRequest): Promise<Cart> {
        const product = await this.productRepository.findById(request.productId)

        if (!product) {
            throw new BusinessError('Produto não encontrado.')
        }

        if (product.stock < request.quantity) {
            throw new BusinessError('Stock insuficiente.')
        }

        let cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart) {
            cart = Cart.create({ userId: request.userId })
            await this.cartRepository.create(cart)
        }

        const item = CartItem.create({
            cartId: cart.id,
            productId: request.productId,
            quantity: request.quantity,
        })

        cart.addItem(item)

        return await this.cartRepository.update(cart)
    }
}