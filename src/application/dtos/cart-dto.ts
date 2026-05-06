import { Cart } from '../../domain/entities/cart'

export interface CartItemDTO {
    id: string
    cartId: string
    productId: string
    quantity: number
}

export interface CartDTO {
    id: string
    userId: string
    items: CartItemDTO[]
    updatedAt: Date
}

export function toCartDTO(cart: Cart): CartDTO {
    return {
        id: cart.id,
        userId: cart.userId,
        items: cart.items.map(item => ({
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
        })),
        updatedAt: cart.updatedAt,
    }
}
