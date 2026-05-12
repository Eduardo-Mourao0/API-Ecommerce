import { Product } from '../../domain/entities/product'
import { ProductRepository } from '../../domain/repositories/product-repository'
import { PrismaRepositoryClient } from '../database/prisma/prisma-repository-client'

export class PrismaProductRepository implements ProductRepository {
    constructor(private readonly prisma: PrismaRepositoryClient) {}

    async create(product: Product): Promise<Product> {
        await this.prisma.product.create({
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
        const data = await this.prisma.product.findUnique({ where: { id } })
        if (!data) return null
        return Product.createFromPrimitives({...data,
            price: Number(data.price)
        })
        
    }

    async findExactMatch(product: Product): Promise<Product | null> {
        const data = await this.prisma.product.findFirst({
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
        const products = await this.prisma.product.findMany({
        where: { name: { contains: name, mode: 'insensitive' } },
        })
        return products.map(p => Product.createFromPrimitives({
        ...p,
        price: Number(p.price)
        }))
    }

    async findAll(): Promise<Product[]> {
        const products = await this.prisma.product.findMany()
        return products.map(p => Product.createFromPrimitives({
        ...p,
        price: Number(p.price)
        }))
    }

    async update(product: Product): Promise<Product> {
        await this.prisma.product.update({
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
        await this.prisma.product.delete({ where: { id } })
    }
}
