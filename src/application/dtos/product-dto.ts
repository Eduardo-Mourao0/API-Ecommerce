import { Product } from '../../domain/entities/product'

export interface ProductDTO {
    id: string
    name: string
    description: string
    price: number
    stock: number
    createdAt: Date
}

export function toProductDTO(product: Product): ProductDTO {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        createdAt: product.createdAt,
    }
}
