import { Cart } from '../../domain/entities/cart'

export interface CartItemDTO {
    id: string
    productId: string
    name: string | null
    price: number | null
    quantity: number
    subtotal: number
}

export interface CartDTO {
    id: string
    userId: string
    items: CartItemDTO[]
    total: number
    updatedAt: Date
}

export function toCartDTO(cart: Cart): CartDTO {
    const items = cart.items.map(item => {
        const price = item.productPrice ?? null

        return {
            id: item.id,
            productId: item.productId,
            name: item.productName ?? null,
            price,
            quantity: item.quantity,
            subtotal: price ? price * item.quantity : 0,
        }
    })

    return {
        id: cart.id,
        userId: cart.userId,
        items,
        total: items.reduce((total, item) => total + item.subtotal, 0),
        updatedAt: cart.updatedAt,
    }
}
