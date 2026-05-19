import { v4 as uuidv4 } from 'uuid'
import { BusinessError } from '../errors/business-error'
import { InvalidNameError } from '../errors/invalid-name-error'

interface ProductProps {
    id?: string
    name: string
    description: string
    price: number
    stock: number
    createdAt?: Date
}

interface UpdateProductProps {
    name?: string
    description?: string
    price?: number
    stock?: number
}

export class Product {
    public readonly id: string
    public name: string
    public description: string
    public price: number
    public stock: number
    public readonly createdAt: Date

    constructor(props: ProductProps) {
        this.id = props.id ?? uuidv4()
        this.name = props.name
        this.description = props.description
        this.price = props.price
        this.stock = props.stock
        this.createdAt = props.createdAt ?? new Date()
    }

    update(props: UpdateProductProps): void {
        
        const name = props.name ?? this.name
        const description = props.description ?? this.description
        const price = props.price ?? this.price
        const stock = props.stock ?? this.stock

        Product.validate({
            name,
            description,
            price,
            stock,
        })

        this.name = name
        this.description = description
        this.price = price
        this.stock = stock
    }

    static create(props: ProductProps): Product {
        Product.validate(props)

        return new Product(props)
    }

    static createFromPrimitives(data: Required<ProductProps>): Product {
        return new Product(data)
    }

    private static validate(props: {
        name: string
        description: string
        price: number
        stock: number
    }): void {
        if (!props.name || props.name.trim().length === 0) {
            throw new InvalidNameError()
        }

        if (!props.description || props.description.trim().length === 0) {
            throw new BusinessError('Descricao nao pode estar vazia.')
        }

        if (props.price <= 0) {
            throw new BusinessError('Preco deve ser maior que zero.')
        }

        if (props.stock < 0) {
            throw new BusinessError('Stock nao pode ser negativo.')
        }
    }
}
