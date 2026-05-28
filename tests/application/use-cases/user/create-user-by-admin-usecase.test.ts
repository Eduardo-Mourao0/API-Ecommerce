import { describe, expect, it } from 'vitest'
import { CreateUserByAdminUseCase } from '../../../../src/application/use-cases/user/create-user-by-admin-usecase'
import { User } from '../../../../src/domain/entities/user'
import { FakePasswordHasher } from '../../../fakes/fake-password-hasher'
import { FakeUserRepository } from '../../../fakes/fake-user-repository'

function makeSut() {
    const userRepository = new FakeUserRepository()
    const passwordHasher = new FakePasswordHasher()
    const createUserByAdminUseCase = new CreateUserByAdminUseCase(userRepository, passwordHasher)

    return {
        userRepository,
        createUserByAdminUseCase,
    }
}

describe('CreateUserByAdminUseCase', () => {
    it('should create a user with admin role', async () => {
        const { userRepository, createUserByAdminUseCase } = makeSut()

        const user = await createUserByAdminUseCase.execute({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })

        expect(user.role).toBe('ADMIN')
        expect(userRepository.users).toHaveLength(1)
        expect(userRepository.users[0].password).toBe('hashed-password123')
    })

    it('should throw when email is already in use', async () => {
        const { userRepository, createUserByAdminUseCase } = makeSut()
        userRepository.users.push(User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'hashed-password123',
            role: 'ADMIN',
        }))

        await expect(createUserByAdminUseCase.execute({
            name: 'Other Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })).rejects.toMatchObject({
            message: 'Email already in use',
            statusCode: 409,
        })
    })
})
