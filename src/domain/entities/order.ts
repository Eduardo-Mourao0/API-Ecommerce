import { v4 as uuidv4 } from 'uuid'
import { OrderItem } from './order-item'
import { BusinessError } from '../errors/business-error'

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED'

export class Order {
    public readonly id: string
    public readonly userId: string
    public status: OrderStatus
    public readonly valuerTotal: number
    public readonly createdAt: Date
    public readonly items: OrderItem[]

    constructor(props: {
        id?: string
        userId: string
        status?: OrderStatus
        valuerTotal: number
        createdAt?: Date
        items: OrderItem[]
    }) {
        this.id = props.id ?? uuidv4()
        this.userId = props.userId
        this.status = props.status ?? 'PENDING'
        this.valuerTotal = props.valuerTotal
        this.createdAt = props.createdAt ?? new Date()
        this.items = props.items
    }

    static create(props: {
        userId: string
        valuerTotal: number
        items: OrderItem[]
    }): Order {
        if (props.items.length === 0) {
            throw new BusinessError('O pedido deve ter pelo menos um item.')
        }

        if (props.valuerTotal <= 0) {
            throw new BusinessError('O total deve ser maior que zero.')
        }

        return new Order(props)
    }

    static createFromPrimitives(data: {
        id: string
        userId: string
        status: OrderStatus
        valuerTotal: number
        createdAt: Date
        items: OrderItem[]
    }): Order {
        return new Order(data)
    }

    cancel(): void {
        if (this.status === 'PAID') {
            throw new BusinessError('Não é possível cancelar um pedido já pago.')
        }

        this.status = 'CANCELLED'
    }

    pay(): void {
        if (this.status === 'CANCELLED') {
            throw new BusinessError('Não é possível pagar um pedido cancelado.')
        }

        this.status = 'PAID'
    }
}