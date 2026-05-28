import { describe, expect, it } from 'vitest'
import { OrderItem } from '../../../src/domain/entities/order-item'

describe('OrderItem', () => {
    it('should create a valid order item', () => {
        const item = OrderItem.create({
            productId: 'product-1',
            quantity: 2,
            price: 100,
        })

        expect(item).toHaveProperty('id')
        expect(item.productId).toBe('product-1')
        expect(item.quantity).toBe(2)
        expect(item.price).toBe(100)
    })

    it('should throw when quantity is less than or equal to zero', () => {
        expect(() => OrderItem.create({
            productId: 'product-1',
            quantity: 0,
            price: 100,
        })).toThrow('Quantidade deve ser maior que zero.')
    })

    it('should throw when price is less than or equal to zero', () => {
        expect(() => OrderItem.create({
            productId: 'product-1',
            quantity: 2,
            price: 0,
        })).toThrow('Preço deve ser maior que zero.')
    })
})
