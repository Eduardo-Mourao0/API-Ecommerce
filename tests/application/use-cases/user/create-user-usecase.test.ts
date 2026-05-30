import { describe, it, expect, vi } from 'vitest'
import { CreateUserUseCase } from '../../../../src/application/use-cases/user/create-user-usecase'
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
  const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher)

  return {
    userRepository,
    passwordHasher,
    createUserUseCase,
  }
}

describe('CreateUserUseCase', () => {
  it('should create a user when email is not in use', async () => {
    const { userRepository, passwordHasher, createUserUseCase } = makeSut()
    vi.mocked(userRepository.findByEmail).mockResolvedValue(null)
    
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    }
    const user = await createUserUseCase.execute(userData)

    // Verifica os dados retornados pelo use case.
    expect(user).toHaveProperty('id')
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john.doe@example.com')
    expect(user.role).toBe('CLIENT')

    // Garante que o use case consultou duplicidade pelo email recebido.
    expect(userRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com')

    // Garante que a senha pura passou pelo hasher antes de salvar.
    expect(passwordHasher.hash).toHaveBeenCalledWith('password123')

    // Garante que o usuario foi persistido exatamente uma vez.
    expect(userRepository.create).toHaveBeenCalledTimes(1)

    // Verifica os dados enviados ao repositorio, incluindo senha hasheada e role padrao.
    expect(userRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashed-password123',
      role: 'CLIENT',
    }))
  })

  it('should not create a user when email is already in use', async () => {
    const { userRepository, createUserUseCase } = makeSut()

    const existingUser = User.create({
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashed-password123',
      role: 'CLIENT'
    })
    vi.mocked(userRepository.findByEmail).mockResolvedValue(existingUser)

    await expect(createUserUseCase.execute({
      name: 'John Doe',
      email: 'jane.doe@example.com',
      password: 'password123'
    })).rejects.toMatchObject({
      message: 'Email already in use',
      statusCode: 409,
    })

    expect(userRepository.findByEmail).toHaveBeenCalledWith('jane.doe@example.com')
    expect(userRepository.create).not.toHaveBeenCalled()
  })
})
