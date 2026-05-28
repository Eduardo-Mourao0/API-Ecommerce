import { describe, it, expect } from 'vitest'
import { User } from '../../../../src/domain/entities/user'
import { LoginUserUseCase } from '../../../../src/application/use-cases/user/login-usecase'
import { FakePasswordHasher } from '../../../fakes/fake-password-hasher'
import { FakeTokenGenerator } from '../../../fakes/fake-token-generator'
import { FakeUserRepository } from '../../../fakes/fake-user-repository'

function makeSut() {
    const userRepository = new FakeUserRepository()
    const passwordHasher = new FakePasswordHasher()
    const tokenGenerator = new FakeTokenGenerator()

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
    const { userRepository, loginUserUseCase } = makeSut()

    const existingUser = User.create({
        id: 'user-1',
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'hashed-password123',
        role: 'CLIENT',
    })
    userRepository.users.push(existingUser)

    const result = await loginUserUseCase.execute({
        email: 'jane.doe@example.com',
        password: 'password123',
    })

    expect(result.token).toBe('token-user-1-CLIENT')

    })

    it('should not login when email does not exist', async () => {
        const { loginUserUseCase } = makeSut()

        await expect(
            loginUserUseCase.execute({
            email: 'nonexistent@example.com',
            password: 'password123',
        })
        ).rejects.toMatchObject({
            message: 'Email ou senha invalidos.',
            statusCode: 401,
        })
    })

    it('should not login when password is incorrect', async () => {
        const { userRepository, loginUserUseCase } = makeSut()

        const existingUser = User.create({
            id: 'user-1',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'hashed-password123',
            role: 'CLIENT',
        })
        userRepository.users.push(existingUser)

        await expect(
            loginUserUseCase.execute({
            email: 'jane.doe@example.com',
            password: 'wrong-password',
        })
        ).rejects.toMatchObject({
            message: 'Email ou senha invalidos.',
            statusCode: 401,
        })
        })
})
