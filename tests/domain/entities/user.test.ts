import { describe, expect, it } from 'vitest'
import { User } from '../../../src/domain/entities/user'
import { InvalidEmailError } from '../../../src/domain/errors/invalid-email-error'
import { InvalidNameError } from '../../../src/domain/errors/invalid-name-error'
import { InvalidPasswordError } from '../../../src/domain/errors/invalid-password-error'

describe('User', () => {
    it('should create a valid user with default client role', () => {
        const user = User.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
        })

        expect(user).toHaveProperty('id')
        expect(user.name).toBe('John Doe')
        expect(user.email).toBe('john.doe@example.com')
        expect(user.password).toBe('password123')
        expect(user.role).toBe('CLIENT')
        expect(user.createdAt).toBeInstanceOf(Date)
    })

    it('should create a user with admin role when role is provided', () => {
        const user = User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })

        expect(user.role).toBe('ADMIN')
    })

    it('should throw InvalidNameError when name is empty', () => {
        expect(() => User.create({
            name: '',
            email: 'john.doe@example.com',
            password: 'password123',
        })).toThrow(InvalidNameError)
    })

    it('should throw InvalidEmailError when email is invalid', () => {
        expect(() => User.create({
            name: 'John Doe',
            email: 'invalid-email',
            password: 'password123',
        })).toThrow(InvalidEmailError)
    })

    it('should throw InvalidPasswordError when password has less than 4 characters', () => {
        expect(() => User.create({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: '123',
        })).toThrow(InvalidPasswordError)
    })
})
