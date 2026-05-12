import { Prisma } from '@prisma/client'
import { Order } from '../../domain/entities/order'
import { OrderItem } from '../../domain/entities/order-item'
import { IOrderRepository } from '../../domain/repositories/order-repository'
import { PrismaRepositoryClient } from '../database/prisma/prisma-repository-client'

type OrderWithItems = Prisma.OrderGetPayload<{
    include: { items: true }
}>

export class PrismaOrderRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaRepositoryClient) {}

    async create(order: Order): Promise<Order> {
        await this.prisma.order.create({
        data: {
            id: order.id,
            userId: order.userId,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt,
            items: {
            create: order.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            })),
            },
        },
        })

        return order
    }

    async findById(id: string): Promise<Order | null> {
        const data = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        })

        if (!data) return null

        return this.toDomain(data)
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
        })

        return orders.map(this.toDomain)
    }

    async update(order: Order): Promise<Order> {
        await this.prisma.order.update({
            where: { id: order.id },
            data: { status: order.status },
        })

        return order
    }

    private toDomain(order: OrderWithItems): Order {
        return Order.createFromPrimitives({
        id: order.id,
        userId: order.userId,
        status: order.status as any,
        total: Number(order.total),
        createdAt: order.createdAt,
        items: order.items.map(item =>
            OrderItem.createFromPrimitives({
            ...item,
            price: Number(item.price),
            })
        ),
        })
    }
}
