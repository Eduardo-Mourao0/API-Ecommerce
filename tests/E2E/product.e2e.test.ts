import { randomUUID } from 'crypto'
import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/main/app'
import { prisma } from '../../src/infra/database/prisma/prisma-client'
import { cleanDatabase, createProduct, createUser, login } from './helpers'

describe('Product E2E test', () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('should create a product when authenticated user is admin', async () => {
        await createUser({
            email: 'admin@example.com',
            role: 'ADMIN',
        })
        const token = await login('admin@example.com')

        const response = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Keyboard',
                description: 'Mechanical keyboard',
                price: 250,
                stock: 10,
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name', 'Keyboard')
        expect(response.body).toHaveProperty('price', 250)
        expect(response.body).toHaveProperty('stock', 10)
    })

    it('should deny product creation when authenticated user is client', async () => {
        await createUser({
            email: 'client@example.com',
            role: 'CLIENT',
        })
        const token = await login('client@example.com')

        const response = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Keyboard',
                description: 'Mechanical keyboard',
                price: 250,
                stock: 10,
            })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', 'Acesso negado.')
    })
    
    it('should reject product creation with invalid price', async () => {
        await createUser({
            email: 'admin@example.com',
            role: 'ADMIN',
        })
        const token = await login('admin@example.com')

        const response = await request(app)
            .post('/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Keyboard',
                description: 'Mechanical keyboard',
                price: -1,
                stock: 10,
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error', 'ValidationError')
    })

    it('should list products without authentication', async () => {
        await createProduct({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
            price: 250,
            stock: 10,
        })

        const response = await request(app).get('/products')

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('name', 'Keyboard')
    })

    it('should search products by name without authentication', async () => {
        await createProduct({
            name: 'Keyboard',
            description: 'Mechanical keyboard',
        })
        await createProduct({
            name: 'Mouse',
            description: 'Wireless mouse',
        })

        const response = await request(app)
            .get('/products/search')
            .query({ name: 'key' })

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('name', 'Keyboard')
    })

    it('should update a product when authenticated user is admin', async () => {
        await createUser({
            email: 'admin@example.com',
            role: 'ADMIN',
        })
        const token = await login('admin@example.com')
        const product = await createProduct({
            id: randomUUID(),
            name: 'Keyboard',
            price: 250,
        })

        const response = await request(app)
            .put(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Mouse',
                price: 120,
            })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id', product.id)
        expect(response.body).toHaveProperty('name', 'Mouse')
        expect(response.body).toHaveProperty('price', 120)
    })

    it('should delete a product when authenticated user is admin', async () => {
        await createUser({
            email: 'admin@example.com',
            role: 'ADMIN',
        })
        const token = await login('admin@example.com')
        const product = await createProduct()

        const response = await request(app)
            .delete(`/products/${product.id}`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('message', 'Produto deletado com sucesso.')
        await expect(prisma.product.findUnique({ where: { id: product.id } }))
            .resolves.toBeNull()
    })
})
