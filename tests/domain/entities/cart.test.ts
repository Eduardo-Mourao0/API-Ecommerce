import { describe, expect, it } from 'vitest'
import { Cart } from '../../../src/domain/entities/cart'
import { CartItem } from '../../../src/domain/entities/cart-item'

describe('Cart', () => {
    it('should add a new item to cart', () => {
        const cart = Cart.create({ userId: 'user-1' })
        const item = CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 2,
        })

        cart.addItem(item, 5)

        expect(cart.items).toHaveLength(1)
        expect(cart.items[0].quantity).toBe(2)
    })

    it('should increase quantity when adding an existing product', () => {
        const cart = Cart.create({ userId: 'user-1' })

        cart.addItem(CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 2,
        }), 5)
        cart.addItem(CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 3,
        }), 5)

        expect(cart.items).toHaveLength(1)
        expect(cart.items[0].quantity).toBe(5)
    })

    it('should throw when quantity exceeds stock', () => {
        const cart = Cart.create({ userId: 'user-1' })
        const item = CartItem.create({
            cartId: cart.id,
            productId: 'product-1',
            quantity: 6,
        })

        expect(() => cart.addItem(item, 5)).toThrow('Quantidade solicitada excede o estoque disponível.')
    })

    it('should remove an item from cart', () => {
        const cart = Cart.create({ userId: 'user-1' })
        const item = CartItem.createFromPrimitives({
            id: 'item-1',
            cartId: cart.id,
            productId: 'product-1',
            quantity: 2,
        })

        cart.addItem(item, 5)
        cart.removeItem('item-1')

        expect(cart.items).toHaveLength(0)
    })
})
