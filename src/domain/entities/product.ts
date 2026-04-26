import { v4 as uuidv4 } from 'uuid'
import { InvalidNameError } from '../errors/invalid-name-error'
import { BusinessError } from '../errors/business-error'

export class Product {
    public readonly id: string
    public name: string
    public description: string
    public price: number
    public stock: number
    public readonly createdAt: Date

    constructor(props: {
        id?: string
        name: string
        description: string
        price: number
        stock: number
        createdAt?: Date
    }) {
        this.id = props.id ?? uuidv4()
        this.name = props.name
        this.description = props.description
        this.price = props.price
        this.stock = props.stock
        this.createdAt = props.createdAt ?? new Date()
    }

    static create(props: {  
        name: string
        description: string
        price: number
        stock: number
    }): Product {
        if (!props.name || props.name.trim().length === 0) {
            throw new InvalidNameError()
        }

        if (!props.description || props.description.trim().length === 0) {
            throw new BusinessError('Descrição não pode estar vazia.')
        }

        if (props.price <= 0) {
            throw new BusinessError('Preço deve ser maior que zero.')
        }

        if (props.stock < 0) {
            throw new BusinessError('Stock não pode ser negativo.')
        }

        return new Product(props)
    }

    static createFromPrimitives(data: {
        id: string
        name: string
        description: string
        price: number
        stock: number
        createdAt: Date
    }): Product {
        return new Product(data)
    }
}
