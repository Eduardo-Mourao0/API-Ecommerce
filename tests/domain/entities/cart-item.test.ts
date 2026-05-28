import { describe, expect, it } from 'vitest'
import { CartItem } from '../../../src/domain/entities/cart-item'

describe('CartItem', () => {
    it('should create a valid cart item', () => {
        const item = CartItem.create({
            cartId: 'cart-1',
            productId: 'product-1',
            quantity: 2,
        })

        expect(item).toHaveProperty('id')
        expect(item.cartId).toBe('cart-1')
        expect(item.productId).toBe('product-1')
        expect(item.quantity).toBe(2)
    })

    it('should throw when quantity is less than or equal to zero', () => {
        expect(() => CartItem.create({
            cartId: 'cart-1',
            productId: 'product-1',
            quantity: 0,
        })).toThrow('Quantidade deve ser maior que zero.')
    })
})
