import { CartDTO, toCartDTO } from '../../dtos/cart-dto'
import { Cart } from '../../../domain/entities/cart'
import { CartItem } from '../../../domain/entities/cart-item'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface AddItemToCartRequest {
    userId: string
    productId: string
    quantity: number
}

type CartRepositoryFactory = (tx: PrismaTransactionClient) => CartRepository
type ProductRepositoryFactory = (tx: PrismaTransactionClient) => ProductRepository

export class AddItemToCartUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private cartRepositoryFactory: CartRepositoryFactory,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: AddItemToCartRequest): Promise<CartDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const cartRepository = this.cartRepositoryFactory(tx)
            const productRepository = this.productRepositoryFactory(tx)
            
            const product = await productRepository.findById(request.productId)

            if (!product) {
                throw new BusinessError('Produto n\u00e3o encontrado.')
            }

            if (product.stock < request.quantity) {
                throw new BusinessError('Stock insuficiente.')
            }

            let cart = await cartRepository.findByUserId(request.userId)

            if (!cart) {
                cart = Cart.create({ userId: request.userId })
                await cartRepository.create(cart)
            }

            const item = CartItem.create({
                cartId: cart.id,
                productId: request.productId,
                quantity: request.quantity,
            })

            cart.addItem(item)

            const updatedCart = await cartRepository.update(cart)

            return toCartDTO(updatedCart)
        })
    }
}
