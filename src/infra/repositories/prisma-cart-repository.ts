import { Prisma } from '@prisma/client'
import { Cart } from '../../domain/entities/cart'
import { CartItem } from '../../domain/entities/cart-item'
import { CartRepository } from '../../domain/repositories/cart-repository'
import { PrismaRepositoryClient } from '../database/prisma/prisma-repository-client'

type CartWithItems = Prisma.CartGetPayload<{
    include: { items: { include: { product: true } } }
}>

export class PrismaCartRepository implements CartRepository {
    constructor(private readonly prisma: PrismaRepositoryClient) {}

    async create(cart: Cart): Promise<Cart> {
        await this.prisma.cart.create({
            data: this.toCreateData(cart),
        })

        return cart
    }

    async findByUserId(userId: string): Promise<Cart | null> {
        const data = await this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        })

        if (!data) return null

        return this.toDomain(data)
    }

    async update(cart: Cart): Promise<Cart> {
        await this.prisma.cart.update({
            where: { id: cart.id },
            data: { updatedAt: cart.updatedAt },
        })

        await this.deleteRemovedItems(cart)
        await this.upsertItems(cart.items)

        return (await this.findByUserId(cart.userId)) ?? cart
    }

    async clear(cartId: string): Promise<void> {
        await this.prisma.cartItem.deleteMany({ where: { cartId } })
    }

    private toCreateData(cart: Cart): Prisma.CartUncheckedCreateInput {
        return {
            id: cart.id,
            userId: cart.userId,
            createdAt: cart.updatedAt,
            updatedAt: cart.updatedAt,
        }
    }

    private toDomain(cart: CartWithItems): Cart {
        return Cart.createFromPrimitives({
            id: cart.id,
            userId: cart.userId,
            updatedAt: cart.updatedAt,
            items: cart.items.map(item => CartItem.createFromPrimitives({
                id: item.id,
                cartId: item.cartId,
                productId: item.productId,
                quantity: item.quantity,
                productName: item.product.name,
                productPrice: Number(item.product.price),
            })),
        })
    }

    private async deleteRemovedItems(cart: Cart): Promise<void> {
        const itemIds = cart.items.map(item => item.id)

        await this.prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                id: { notIn: itemIds },
            },
        })
    }

    private async upsertItems(items: CartItem[]): Promise<void> {
        for (const item of items) {
            await this.prisma.cartItem.upsert({
                where: { id: item.id },
                update: { quantity: item.quantity },
                create: {
                    id: item.id,
                    cartId: item.cartId,
                    productId: item.productId,
                    quantity: item.quantity,
                },
            })
        }
    }
}
