import { describe, expect, it, vi } from 'vitest'
import { CreateUserByAdminUseCase } from '../../../../src/application/use-cases/user/create-user-by-admin-usecase'
import { User } from '../../../../src/domain/entities/user'
import { UserRepository } from '../../../../src/domain/repositories/user-repository'
import { PasswordHasher } from '../../../../src/domain/services/password-hasher'

function makeSut() {
    const userRepository: UserRepository = {
        create: vi.fn(async user => user),
        findByEmail: vi.fn(),
        findById: vi.fn(),
        findAll: vi.fn(),
        delete: vi.fn(),
    }
    const passwordHasher: PasswordHasher = {
        hash: vi.fn(async password => `hashed-${password}`),
        compare: vi.fn(),
    }
    const createUserByAdminUseCase = new CreateUserByAdminUseCase(userRepository, passwordHasher)

    return {
        userRepository,
        passwordHasher,
        createUserByAdminUseCase,
    }
}

describe('CreateUserByAdminUseCase', () => {
    it('should create a user with admin role', async () => {
        const { userRepository, passwordHasher, createUserByAdminUseCase } = makeSut()
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

        const user = await createUserByAdminUseCase.execute({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })

        expect(user.role).toBe('ADMIN')
        expect(userRepository.findByEmail).toHaveBeenCalledWith('admin@example.com')
        expect(passwordHasher.hash).toHaveBeenCalledWith('password123')
        expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
            email: 'admin@example.com',
            password: 'hashed-password123',
            role: 'ADMIN',
        }))
    })

    it('should throw when email is already in use', async () => {
        const { userRepository, createUserByAdminUseCase } = makeSut()
        const existingUser = User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'hashed-password123',
            role: 'ADMIN',
        })
        vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser)

        await expect(createUserByAdminUseCase.execute({
            name: 'Other Admin',
            email: 'admin@example.com',
            password: 'password123',
            role: 'ADMIN',
        })).rejects.toMatchObject({
            message: 'Email already in use',
            statusCode: 409,
        })
        expect(userRepository.create).not.toHaveBeenCalled()
    })
})
