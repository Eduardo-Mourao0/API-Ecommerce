import { describe, expect, it, vi } from 'vitest'
import { User } from '../../../../src/domain/entities/user'
import { LoginUserUseCase } from '../../../../src/application/use-cases/user/login-usecase'
import { UserRepository } from '../../../../src/domain/repositories/user-repository'
import { PasswordHasher } from '../../../../src/domain/services/password-hasher'
import { TokenGenerator } from '../../../../src/domain/services/token-generator'

function makeSut() {
    const userRepository: UserRepository = {
        create: vi.fn(),
        findByEmail: vi.fn(),
        findById: vi.fn(),
        findAll: vi.fn(),
        delete: vi.fn(),
    }
    const passwordHasher: PasswordHasher = {
        hash: vi.fn(),
        compare: vi.fn(),
    }
    const tokenGenerator: TokenGenerator = {
        generate: vi.fn(payload => `token-${payload.id}-${payload.role}`),
        verify: vi.fn(),
    }
    const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator)

    return {
        userRepository,
        passwordHasher,
        tokenGenerator,
        loginUserUseCase,
    }
}

describe('LoginUserUseCase', () => {
    it('should login when email and password are valid', async () => {
        const { userRepository, passwordHasher, tokenGenerator, loginUserUseCase } = makeSut()
        const existingUser = User.create({
            id: 'user-1',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'hashed-password123',
            role: 'CLIENT',
        })
        vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser)
        vi.mocked(passwordHasher.compare).mockResolvedValue(true)

        const result = await loginUserUseCase.execute({
            email: 'jane.doe@example.com',
            password: 'password123',
        })

        expect(result.token).toBe('token-user-1-CLIENT')
        expect(userRepository.findByEmail).toHaveBeenCalledWith('jane.doe@example.com')
        expect(passwordHasher.compare).toHaveBeenCalledWith('password123', 'hashed-password123')
        expect(tokenGenerator.generate).toHaveBeenCalledWith({
            id: 'user-1',
            role: 'CLIENT',
        })
    })

    it('should not login when email does not exist', async () => {
        const { userRepository, passwordHasher, tokenGenerator, loginUserUseCase } = makeSut()
        vi.mocked(userRepository.findByEmail).mockResolvedValue(null)

        await expect(loginUserUseCase.execute({
            email: 'nonexistent@example.com',
            password: 'password123',
        })).rejects.toMatchObject({
            message: 'Email ou senha invalidos.',
            statusCode: 401,
        })
        expect(passwordHasher.compare).not.toHaveBeenCalled()
        expect(tokenGenerator.generate).not.toHaveBeenCalled()
    })

    it('should not login when password is incorrect', async () => {
        const { userRepository, passwordHasher, tokenGenerator, loginUserUseCase } = makeSut()
        const existingUser = User.create({
            id: 'user-1',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'hashed-password123',
            role: 'CLIENT',
        })
        vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser)
        vi.mocked(passwordHasher.compare).mockResolvedValue(false)

        await expect(loginUserUseCase.execute({
            email: 'jane.doe@example.com',
            password: 'wrong-password',
        })).rejects.toMatchObject({
            message: 'Email ou senha invalidos.',
            statusCode: 401,
        })
        expect(tokenGenerator.generate).not.toHaveBeenCalled()
    })
})
