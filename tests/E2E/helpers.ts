import { randomUUID } from 'crypto'
import bcrypt from 'bcryptjs'
import request from 'supertest'
import { app } from '../../src/main/app'
import { prisma } from '../../src/infra/database/prisma/prisma-client'

export async function cleanDatabase() {
    await prisma.log.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.cartItem.deleteMany()
    await prisma.cart.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
}

export async function createUser(params?: {
    id?: string
    name?: string
    email?: string
    password?: string
    role?: 'ADMIN' | 'CLIENT'
}) {
    const password = params?.password ?? 'password123'

    return prisma.user.create({
        data: {
            id: params?.id ?? randomUUID(),
            name: params?.name ?? 'John Doe',
            email: params?.email ?? 'john.doe@example.com',
            password: await bcrypt.hash(password, 10),
            role: params?.role ?? 'CLIENT',
        },
    })
}

export async function login(email: string, password = 'password123') {
    const response = await request(app)
        .post('/login')
        .send({ email, password })

    return response.body.token as string
}

export async function createProduct(params?: {
    id?: string
    name?: string
    description?: string
    price?: number
    stock?: number
}) {
    return prisma.product.create({
        data: {
            id: params?.id ?? randomUUID(),
            name: params?.name ?? 'Keyboard',
            description: params?.description ?? 'Mechanical keyboard',
            price: params?.price ?? 250,
            stock: params?.stock ?? 10,
        },
    })
}
