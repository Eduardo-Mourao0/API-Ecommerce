import { describe, expect, it } from 'vitest'
import { Order } from '../../../src/domain/entities/order'
import { OrderItem } from '../../../src/domain/entities/order-item'

function makeOrderItem() {
    return OrderItem.create({
        productId: 'product-1',
        quantity: 2,
        price: 100,
    })
}

describe('Order', () => {
    it('should create a pending order with valid data', () => {
        const order = Order.create({
            userId: 'user-1',
            total: 200,
            items: [makeOrderItem()],
        })

        expect(order).toHaveProperty('id')
        expect(order.userId).toBe('user-1')
        expect(order.status).toBe('PENDING')
        expect(order.total).toBe(200)
        expect(order.items).toHaveLength(1)
    })

    it('should throw when order has no items', () => {
        expect(() => Order.create({
            userId: 'user-1',
            total: 200,
            items: [],
        })).toThrow('O pedido deve ter pelo menos um item.')
    })

    it('should cancel a pending order', () => {
        const order = Order.create({
            userId: 'user-1',
            total: 200,
            items: [makeOrderItem()],
        })

        order.cancel()

        expect(order.status).toBe('CANCELLED')
    })

    it('should pay a pending order', () => {
        const order = Order.create({
            userId: 'user-1',
            total: 200,
            items: [makeOrderItem()],
        })

        order.pay()

        expect(order.status).toBe('PAID')
    })

    it('should not cancel a paid order', () => {
        const order = Order.create({
            userId: 'user-1',
            total: 200,
            items: [makeOrderItem()],
        })
        order.pay()

        expect(() => order.cancel()).toThrow('Pedido ja foi pago.')
    })
})
