import { Cart } from '../../src/domain/entities/cart'
import { CartRepository } from '../../src/domain/repositories/cart-repository'

export class FakeCartRepository implements CartRepository {
    public carts: Cart[] = []

    async create(cart: Cart): Promise<Cart> {
        this.carts.push(cart)
        return cart
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        return this.carts.find(cart => cart.userId === userId) || null
    }

    async update(cart: Cart): Promise<Cart> {
        const index = this.carts.findIndex(existingCart => existingCart.id === cart.id)

        if (index >= 0) {
            this.carts[index] = cart
        }

        return cart
    }

    async clear(cartId: string): Promise<void> {
        const cart = this.carts.find(cart => cart.id === cartId)

        if (cart) {
            cart.clear()
        }
    }
}
