import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/main/app'
import { prisma } from '../../src/infra/database/prisma/prisma-client'
import { cleanDatabase, createProduct, createUser, login } from './helpers'

async function createClientToken() {
    await createUser({
        email: 'client@example.com',
        role: 'CLIENT',
    })

    return login('client@example.com')
}

async function createPendingOrder(token: string) {
    const product = await createProduct({
        price: 100,
        stock: 10,
    })

    await request(app)
        .post('/cart/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
            productId: product.id,
            quantity: 1,
        })

    return request(app)
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
}

describe('Cart and Order E2E test', () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('should add a product to cart and get cart', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            id: randomUUID(),
            name: 'Keyboard',
            price: 250,
            stock: 10,
        })

        const addResponse = await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })

        expect(addResponse.status).toBe(200)
        expect(addResponse.body.items).toHaveLength(1)
        expect(addResponse.body.items[0]).toHaveProperty('productId', product.id)
        expect(addResponse.body.items[0]).toHaveProperty('quantity', 2)
        expect(addResponse.body.items[0]).toHaveProperty('subtotal', 500)
        expect(addResponse.body).toHaveProperty('total', 500)

        const getResponse = await request(app)
            .get('/cart')
            .set('Authorization', `Bearer ${token}`)

        expect(getResponse.status).toBe(200)
        expect(getResponse.body.items).toHaveLength(1)
        expect(getResponse.body).toHaveProperty('total', 500)
    })

    it('should not add a product to cart when requested quantity exceeds stock', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            stock: 1,
        })

        const response = await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Quantidade solicitada excede o estoque disponível.')
    })

    it('should reject adding item to cart with invalid quantity', async () => {
        const token = await createClientToken()
        const product = await createProduct()

        const response = await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 0,
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error', 'ValidationError')
    })

    it('should remove an item from cart', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            price: 100,
            stock: 10,
        })

        const addResponse = await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })

        const response = await request(app)
            .delete(`/cart/items/${addResponse.body.items[0].id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body.items).toHaveLength(0)
        expect(response.body).toHaveProperty('total', 0)
    })

    it('should clear cart', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            price: 100,
            stock: 10,
        })

        await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })

        const response = await request(app)
            .delete('/cart')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', 'Carrinho limpo com sucesso.')

        const cartResponse = await request(app)
            .get('/cart')
            .set('Authorization', `Bearer ${token}`)

        expect(cartResponse.status).toBe(200)
        expect(cartResponse.body.items).toHaveLength(0)
    })

    it('should throw when removing a cart item that does not exist', async () => {
        const token = await createClientToken()
        const product = await createProduct()

        await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 1,
            })

        const response = await request(app)
            .delete(`/cart/items/${randomUUID()}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Item nao encontrado no carrinho.')
    })

    it('should not create an order without cart', async () => {
        const token = await createClientToken()

        const response = await request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Você nao possui items no carrinho.')
    })

    it('should create an order from cart and decrease product stock', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            id: randomUUID(),
            name: 'Keyboard',
            price: 250,
            stock: 10,
        })

        await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })

        const orderResponse = await request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)

        expect(orderResponse.status).toBe(201)
        expect(orderResponse.body).toHaveProperty('status', 'PENDING')
        expect(orderResponse.body).toHaveProperty('total', 500)
        expect(orderResponse.body.items).toHaveLength(1)

        await expect(prisma.product.findUnique({ where: { id: product.id } }))
            .resolves.toMatchObject({ stock: 8 })

        const cartResponse = await request(app)
            .get('/cart')
            .set('Authorization', `Bearer ${token}`)

        expect(cartResponse.status).toBe(200)
        expect(cartResponse.body.items).toHaveLength(0)
    })

    it('should pay and list user orders', async () => {
        const token = await createClientToken()
        const product = await createProduct({
            price: 100,
            stock: 10,
        })

        await request(app)
            .post('/cart/items')
            .set('Authorization', `Bearer ${token}`)
            .send({
                productId: product.id,
                quantity: 2,
            })
        const orderResponse = await request(app)
            .post('/orders')
            .set('Authorization', `Bearer ${token}`)

        const payResponse = await request(app)
            .patch(`/orders/${orderResponse.body.id}/pay`)
            .set('Authorization', `Bearer ${token}`)

        expect(payResponse.status).toBe(200)
        expect(payResponse.body).toHaveProperty('status', 'PAID')

        const ordersResponse = await request(app)
            .get('/orders')
            .set('Authorization', `Bearer ${token}`)

        expect(ordersResponse.status).toBe(200)
        expect(ordersResponse.body).toHaveLength(1)
        expect(ordersResponse.body[0]).toHaveProperty('status', 'PAID')
    })

    it('should cancel a pending order', async () => {
        const token = await createClientToken()
        const orderResponse = await createPendingOrder(token)

        const cancelResponse = await request(app)
            .patch(`/orders/${orderResponse.body.id}/cancel`)
            .set('Authorization', `Bearer ${token}`)

        expect(cancelResponse.status).toBe(200)
        expect(cancelResponse.body).toHaveProperty('status', 'CANCELLED')
    })

    it('should not cancel a paid order', async () => {
        const token = await createClientToken()
        const orderResponse = await createPendingOrder(token)
        await request(app)
            .patch(`/orders/${orderResponse.body.id}/pay`)
            .set('Authorization', `Bearer ${token}`)

        const response = await request(app)
            .patch(`/orders/${orderResponse.body.id}/cancel`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Pedido ja foi pago.')
    })

    it('should not pay a cancelled order', async () => {
        const token = await createClientToken()
        const orderResponse = await createPendingOrder(token)
        await request(app)
            .patch(`/orders/${orderResponse.body.id}/cancel`)
            .set('Authorization', `Bearer ${token}`)

        const response = await request(app)
            .patch(`/orders/${orderResponse.body.id}/pay`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Pedido ja foi cancelado.')
    })

    it('should not pay an already paid order', async () => {
        const token = await createClientToken()
        const orderResponse = await createPendingOrder(token)
        await request(app)
            .patch(`/orders/${orderResponse.body.id}/pay`)
            .set('Authorization', `Bearer ${token}`)

        const response = await request(app)
            .patch(`/orders/${orderResponse.body.id}/pay`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('message', 'Pedido ja foi pago.')
    })
})
