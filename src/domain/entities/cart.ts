import { v4 as uuidv4 } from 'uuid'
import { CartItem } from './cart-item'
import { BusinessError } from '../errors/business-error'

export class Cart {
    public readonly id: string
    public readonly userId: string
    public items: CartItem[]
    public updatedAt: Date

    constructor(props: {
        id?: string
        userId: string
        items?: CartItem[]
        updatedAt?: Date
    }) {
        this.id = props.id ?? uuidv4()
        this.userId = props.userId
        this.items = props.items ?? []
        this.updatedAt = props.updatedAt ?? new Date()
    }

    static create(props: { userId: string }): Cart {
        return new Cart(props)
    }

    static createFromPrimitives(data: {
        id: string
        userId: string
        items: CartItem[]
        updatedAt: Date
    }): Cart {
        return new Cart(data)
    }

    addItem(item: CartItem, stock: number): void {
        
        const existing = this.items.find(i => i.productId === item.productId)
        
        const currentQuantity = existing ? existing.quantity : 0
        const nextQuantity = currentQuantity + item.quantity

        if (nextQuantity > stock) {
            throw new BusinessError('Quantidade solicitada excede o estoque disponível.')
        }
        if (existing) {
            existing.quantity = nextQuantity
        } else {
            this.items.unshift(item)
        }

        this.updatedAt = new Date()
    }

    removeItem(cartItemId: string): void {
        this.items = this.items.filter(i => i.id !== cartItemId)
        
        this.updatedAt = new Date()
    }

    clear(): void {
        this.items = []
        
        this.updatedAt = new Date()
    }
}