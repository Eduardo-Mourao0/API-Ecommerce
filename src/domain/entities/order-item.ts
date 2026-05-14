import { v4 as uuidv4 } from 'uuid'
import { BusinessError } from '../errors/business-error'

export class OrderItem {
    public readonly id: string
    public readonly productId: string
    public readonly quantity: number
    public readonly price: number

    constructor(props: {
        id?: string
        productId: string
        quantity: number
        price: number
    }) {
        this.id = props.id ?? uuidv4()
        this.productId = props.productId
        this.quantity = props.quantity
        this.price = props.price
    }

    static create(props: {
        productId: string
        quantity: number
        price: number
    }): OrderItem {
        if (props.quantity <= 0) {
            throw new BusinessError('Quantidade deve ser maior que zero.')
        }

        if (props.price <= 0) {
            throw new BusinessError('Preço deve ser maior que zero.')
        }

        return new OrderItem(props)
    }

    static createFromPrimitives(data: {
        id: string
        productId: string
        quantity: number
        price: number
    }): OrderItem {
        return new OrderItem(data)
    }
}