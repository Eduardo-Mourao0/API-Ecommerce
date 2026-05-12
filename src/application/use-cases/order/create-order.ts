import { OrderDTO, toOrderDTO } from '../../dtos/order-dto'
import { Order } from '../../../domain/entities/order'
import { OrderItem } from '../../../domain/entities/order-item'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, TransactionContext } from '../../../domain/managers/ITransactionManager'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { IOrderRepository } from '../../../domain/repositories/order-repository'
import { ProductRepository } from '../../../domain/repositories/product-repository'

interface CreateOrderRequest {
    userId: string
}

type OrderRepositoryFactory = (tx: TransactionContext) => IOrderRepository
type CartRepositoryFactory = (tx: TransactionContext) => CartRepository
type ProductRepositoryFactory = (tx: TransactionContext) => ProductRepository

export class CreateOrderUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private orderRepositoryFactory: OrderRepositoryFactory,
        private cartRepositoryFactory: CartRepositoryFactory,
        private productRepositoryFactory: ProductRepositoryFactory
    ) {}

    async execute(request: CreateOrderRequest): Promise<OrderDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const orderRepository = this.orderRepositoryFactory(tx)
            const cartRepository = this.cartRepositoryFactory(tx)
            const productRepository = this.productRepositoryFactory(tx)
            const cart = await cartRepository.findByUserId(request.userId)

            if (!cart || cart.items.length === 0) {
                throw new BusinessError('Você nao possui items no carrinho.')
            }

            let total = 0
            const orderItems: OrderItem[] = []

            for (const cartItem of cart.items) {
                const product = await productRepository.findById(cartItem.productId)

                if (!product) {
                    throw new BusinessError('Produto nao encontrado.')
                }

                if (product.stock < cartItem.quantity) {
                    throw new BusinessError(`Stock insuficiente para o produto ${product.name}.`)
                }

                product.stock -= cartItem.quantity

                await productRepository.update(product)

                const orderItem = OrderItem.create({
                    orderId: '',
                    productId: product.id,
                    quantity: cartItem.quantity,
                    price: product.price,
                })

                total += product.price * cartItem.quantity
                orderItems.unshift(orderItem)
            }

            const order = Order.create({
                userId: request.userId,
                total,
                items: orderItems,
            })

            await cartRepository.clear(cart.id)

            const createdOrder = await orderRepository.create(order)

            return toOrderDTO(createdOrder)
        })
    }
}
