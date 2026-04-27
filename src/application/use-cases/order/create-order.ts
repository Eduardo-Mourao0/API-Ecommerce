import { Order } from '../../../domain/entities/order'
import { OrderItem } from '../../../domain/entities/order-item'
import { IOrderRepository } from '../../../domain/repositories/order-repository'
import { CartRepository } from '../../../domain/repositories/cart-repository'
import { ProductRepository } from '../../../domain/repositories/product-repository'
import { BusinessError } from '../../../domain/errors/business-error'

interface CreateOrderRequest {
    userId: string
}

export class CreateOrderUseCase {
    constructor(
        private orderRepository: IOrderRepository,
        private cartRepository: CartRepository,
        private productRepository: ProductRepository
    ) {}

    async execute(request: CreateOrderRequest): Promise<Order> {
        const cart = await this.cartRepository.findByUserId(request.userId)

        if (!cart || cart.items.length === 0) {
            throw new BusinessError('Você não possui items no carrinho.')
        }

        let total = 0
        
        const orderItems: OrderItem[] = []

        for (const cartItem of cart.items) {
            
            const product = await this.productRepository.findById(cartItem.productId)

            if (!product) {
                throw new BusinessError(`Produto não encontrado.`)
            }

            if (product.stock < cartItem.quantity) {
                throw new BusinessError(`Stock insuficiente para o produto ${product.name}.`)
            }

            product.stock -= cartItem.quantity

            await this.productRepository.update(product)

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

        await this.cartRepository.clear(cart.id)

        return await this.orderRepository.create(order)
    }
}