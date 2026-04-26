import { v4 as uuidv4 } from 'uuid'
import { BusinessError } from '../errors/business-error'

export class CartItem {
    public readonly id: string
    public readonly cartId: string
    public readonly productId: string
    public quantity: number

    constructor(props: {
        id?: string
        cartId: string
        productId: string
        quantity: number
    }) {
        this.id = props.id ?? uuidv4()
        this.cartId = props.cartId
        this.productId = props.productId
        this.quantity = props.quantity
    }

    static create(props: {
        cartId: string
        productId: string
        quantity: number
    }): CartItem {
        
        if (props.quantity <= 0) {
            throw new BusinessError('Quantidade deve ser maior que zero.')
        }

        return new CartItem(props)
    }

    static createFromPrimitives(data: {
        id: string
        cartId: string
        productId: string
        quantity: number
    }): CartItem {
        return new CartItem(data)
    }
}