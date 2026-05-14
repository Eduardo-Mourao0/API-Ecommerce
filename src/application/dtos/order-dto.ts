import { Order, OrderStatus } from '../../domain/entities/order'

export interface OrderItemDTO {
    id: string
    orderId: string
    productId: string
    quantity: number
    price: number
}

export interface OrderDTO {
    id: string
    userId: string
    status: OrderStatus
    total: number
    createdAt: Date
    items: OrderItemDTO[]
}

export function toOrderDTO(order: Order): OrderDTO {
    return {
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
            id: item.id,
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        })),
    }
}
