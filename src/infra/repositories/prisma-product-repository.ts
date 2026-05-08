import { Product } from '../../domain/entities/product'
import { ProductRepository } from '../../domain/repositories/product-repository'
import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'

export class PrismaProductRepository implements ProductRepository {
    constructor(private readonly tx: PrismaTransactionClient) {}

    async create(product: Product): Promise<Product> {
        await this.tx.product.create({
        data: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
        },
        })

        return product
    }

    async findById(id: string): Promise<Product | null> {
        const data = await this.tx.product.findUnique({ where: { id } })
        if (!data) return null
        return Product.createFromPrimitives({...data,
            price: Number(data.price)
        })
        
    }

    async findExactMatch(product: Product): Promise<Product | null> {
        const data = await this.tx.product.findFirst({
            where: {
                name: { equals: product.name, mode: 'insensitive' },
                description: product.description,
                price: product.price,
            },
        })

        if (!data) return null

        return Product.createFromPrimitives({
            ...data,
            price: Number(data.price),
        })
    }

    async findByName(name: string): Promise<Product[]> {
        const products = await this.tx.product.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
        })
        return products.map(p => Product.createFromPrimitives({
        ...p,
        price: Number(p.price)
        }))
    }

    async findAll(): Promise<Product[]> {
        const products = await this.tx.product.findMany()
        return products.map(p => Product.createFromPrimitives({
        ...p,
        price: Number(p.price)
        }))
    }

    async update(product: Product): Promise<Product> {
        await this.tx.product.update({
        where: { id: product.id },
        data: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        },
        })

        return product
    }

    async delete(id: string): Promise<void> {
        await this.tx.product.delete({ where: { id } })
    }
}
