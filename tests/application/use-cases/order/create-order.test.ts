import { describe, expect, it } from 'vitest'
import { CreateOrderUseCase } from '../../../../src/application/use-cases/order/create-order'
import { Cart } from '../../../../src/domain/entities/cart'
import { CartItem } from '../../../../src/domain/entities/cart-item'
import { Product } from '../../../../src/domain/entities/product'
import { FakeCartRepository } from '../../../fakes/fake-cart-repository'
import { FakeOrderRepository } from '../../../fakes/fake-order-repository'
import { FakeProductRepository } from '../../../fakes/fake-product-repository'
import { FakeTransactionManager } from '../../../fakes/fake-transaction-manager'

function makeSut() {
    const orderRepository = new FakeOrderRepository()
    const cartRepository = new FakeCartRepository()
    const productRepository = new FakeProductRepository()
    const transactionManager = new FakeTransactionManager()
    const createOrderUseCase = new CreateOrderUseCase(
        transactionManager,
        () => orderRepository,
        () => cartRepository,
        () => productRepository
    )

    return {
        orderRepository,
        cartRepository,
        productRepository,
        createOrderUseCase,
    }
}

describe('CreateOrderUseCase', () => {
    it('should create an order from cart items and clear cart', async () => {
        const { orderRepository, cartRepository, productRepository, createOrderUseCase } = makeSut()
        const cart = Cart.create({ userId: 'user-1' })
        cart.addItem(CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 2,
        }), 10)
        cartRepository.carts.push(cart)
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        }))

        const order = await createOrderUseCase.execute({ userId: 'user-1' })

        expect(order.userId).toBe('user-1')
        expect(order.status).toBe('PENDING')
        expect(order.total).toBe(500)
        expect(order.items).toHaveLength(1)
        expect(orderRepository.orders).toHaveLength(1)
        expect(productRepository.products[0].stock).toBe(8)
        expect(cartRepository.carts[0].items).toHaveLength(0)
    })

    it('should throw when cart is empty', async () => {
        const { cartRepository, createOrderUseCase } = makeSut()
        cartRepository.carts.push(Cart.create({ userId: 'user-1' }))

        await expect(createOrderUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Você nao possui items no carrinho.',
                statusCode: 400,
            })
    })

    it('should throw when product has insufficient stock', async () => {
        const { cartRepository, productRepository, createOrderUseCase } = makeSut()
        const cart = Cart.create({ userId: 'user-1' })
        cart.addItem(CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 2,
        }), 10)
        cartRepository.carts.push(cart)
        productRepository.products.push(Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 1,
        }))

        await expect(createOrderUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Produto Keyboard nao possui estoque suficiente.',
                statusCode: 400,
            })
    })
})
