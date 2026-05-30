import { describe, expect, it, vi } from 'vitest'
import { CreateOrderUseCase } from '../../../../src/application/use-cases/order/create-order'
import { Cart } from '../../../../src/domain/entities/cart'
import { CartItem } from '../../../../src/domain/entities/cart-item'
import { Product } from '../../../../src/domain/entities/product'
import { CartRepository } from '../../../../src/domain/repositories/cart-repository'
import { IOrderRepository } from '../../../../src/domain/repositories/order-repository'
import { ProductRepository } from '../../../../src/domain/repositories/product-repository'
import { ITransactionManager } from '../../../../src/domain/managers/ITransactionManager'

function makeSut() {
    const orderRepository: IOrderRepository = {
        create: vi.fn(async order => order),
        findById: vi.fn(),
        findByUserId: vi.fn(),
        update: vi.fn(),
    }
    const cartRepository: CartRepository = {
        create: vi.fn(),
        findByUserId: vi.fn(),
        update: vi.fn(),
        clear: vi.fn(),
    }
    const productRepository: ProductRepository = {
        create: vi.fn(),
        findById: vi.fn(),
        findExactMatch: vi.fn(),
        findByName: vi.fn(),
        findAll: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        decreaseStock: vi.fn(),
    }
    const transactionManager: ITransactionManager = {
        execute: vi.fn(action => action({})),
    }
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

function makeCartWithItem() {
    const cart = Cart.create({ userId: 'user-1' })
    cart.addItem(CartItem.create({
        cartId: cart.id,
        productId: 'product-1',
        quantity: 2,
    }), 10)

    return cart
}

describe('CreateOrderUseCase', () => {
    it('should create an order from cart items and clear cart', async () => {
        const { orderRepository, cartRepository, productRepository, createOrderUseCase } = makeSut()
        const cart = makeCartWithItem()
        const product = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(cart)
        vi.mocked(productRepository.findById).mockResolvedValue(product)
        vi.mocked(productRepository.decreaseStock).mockResolvedValue(true)

        const order = await createOrderUseCase.execute({ userId: 'user-1' })

        expect(order.userId).toBe('user-1')
        expect(order.status).toBe('PENDING')
        expect(order.total).toBe(500)
        expect(order.items).toHaveLength(1)
        expect(productRepository.decreaseStock).toHaveBeenCalledWith('product-1', 2)
        expect(cartRepository.clear).toHaveBeenCalledWith(cart.id)
        expect(orderRepository.create).toHaveBeenCalledTimes(1)
    })

    it('should throw when cart is empty', async () => {
        const { orderRepository, cartRepository, createOrderUseCase } = makeSut()
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(Cart.create({ userId: 'user-1' }))

        await expect(createOrderUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Você nao possui items no carrinho.',
                statusCode: 400,
            })
        expect(orderRepository.create).not.toHaveBeenCalled()
    })

    it('should throw when product has insufficient stock', async () => {
        const { orderRepository, cartRepository, productRepository, createOrderUseCase } = makeSut()
        const product = Product.create({
            id: 'product-1',
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 1,
        })
        vi.mocked(cartRepository.findByUserId).mockResolvedValue(makeCartWithItem())
        vi.mocked(productRepository.findById).mockResolvedValue(product)
        vi.mocked(productRepository.decreaseStock).mockResolvedValue(false)

        await expect(createOrderUseCase.execute({ userId: 'user-1' }))
            .rejects.toMatchObject({
                message: 'Produto Keyboard nao possui estoque suficiente.',
                statusCode: 400,
            })
        expect(orderRepository.create).not.toHaveBeenCalled()
    })
})
