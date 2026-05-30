import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../../src/main/app'
import { prisma } from '../../src/infra/database/prisma/prisma-client'
import { cleanDatabase, createUser, login } from './helpers'

describe('User E2E test', () => {
    beforeEach(async () => {
        await cleanDatabase()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('name', 'John Doe')
        expect(response.body).toHaveProperty('email', 'john.doe@example.com')
        expect(response.body).toHaveProperty('role', 'CLIENT')
        expect(response.body.password).toBeUndefined()
    })

    it('should not create a user with duplicated email', async () => {
        await createUser({
            email: 'john.doe@example.com',
        })

        const response = await request(app)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(409)
        expect(response.body).toHaveProperty('error', 'BusinessError')
        expect(response.body).toHaveProperty('message', 'Email already in use')
    })

    it('should reject user creation with invalid email', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'invalid-email',
                password: 'password123',
            })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('error', 'ValidationError')
        expect(response.body.issues[0]).toHaveProperty('path', 'email')
    })

    it('should create an admin user when authenticated user is admin', async () => {
        await createUser({
            email: 'admin@example.com',
            role: 'ADMIN',
        })
        const token = await login('admin@example.com')

        const response = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New Admin',
                email: 'new.admin@example.com',
                password: 'password123',
                role: 'ADMIN',
            })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('email', 'new.admin@example.com')
        expect(response.body).toHaveProperty('role', 'ADMIN')
        expect(response.body.password).toBeUndefined()
    })

    it('should deny admin user creation without token', async () => {
        const response = await request(app)
            .post('/admin/users')
            .send({
                name: 'New Admin',
                email: 'new.admin@example.com',
                password: 'password123',
                role: 'ADMIN',
            })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error', 'BusinessError')
    })

    it('should deny admin user creation when authenticated user is client', async () => {
        await createUser({
            email: 'client@example.com',
            role: 'CLIENT',
        })
        const token = await login('client@example.com')

        const response = await request(app)
            .post('/admin/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New Admin',
                email: 'new.admin@example.com',
                password: 'password123',
                role: 'ADMIN',
            })

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('message', 'Acesso negado.')
    })

    it('should login with valid credentials', async () => {
        await createUser({
            email: 'john.doe@example.com',
            password: 'password123',
        })

        const response = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'password123',
            })

        expect(response.status).toBe(200)
        expect(response.body.token).toEqual(expect.any(String))
    })

    it('should not login with invalid password', async () => {
        await createUser({
            email: 'john.doe@example.com',
            password: 'password123',
        })

        const response = await request(app)
            .post('/login')
            .send({
                email: 'john.doe@example.com',
                password: 'wrong-password',
            })

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error', 'BusinessError')
        expect(response.body).toHaveProperty('message', 'Email ou senha invalidos.')
    })

    it('should deny user list when token is not provided', async () => {
        const response = await request(app).get('/users')

        expect(response.status).toBe(401)
        expect(response.body).toHaveProperty('error', 'BusinessError')
    })

    it('should deny user list when authenticated user is client', async () => {
        await createUser({
            email: 'client@example.com',
            password: 'password123',
            role: 'CLIENT',
        })

        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'client@example.com',
                password: 'password123',
            })

        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        expect(response.status).toBe(403)
        expect(response.body).toHaveProperty('error', 'BusinessError')
        expect(response.body).toHaveProperty('message', 'Acesso negado.')
    })

    it('should list users when authenticated user is admin', async () => {
        await createUser({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })

        const loginResponse = await request(app)
            .post('/login')
            .send({
                email: 'admin@example.com',
                password: 'password123',
            })

        const response = await request(app)
            .get('/users')
            .set('Authorization', `Bearer ${loginResponse.body.token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)
        expect(response.body[0]).toHaveProperty('email', 'admin@example.com')
        expect(response.body[0]).toHaveProperty('role', 'ADMIN')
        expect(response.body[0].password).toBeUndefined()
    })
})
