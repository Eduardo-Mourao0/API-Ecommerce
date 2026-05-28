import { describe, it, expect } from 'vitest'
import { CreateUserUseCase } from '../../../../src/application/use-cases/user/create-user-usecase'
import { User } from '../../../../src/domain/entities/user'
import { FakePasswordHasher } from '../../../fakes/fake-password-hasher'
import { FakeUserRepository } from '../../../fakes/fake-user-repository'

describe('CreateUserUseCase', () => {
  it('should create a user when email is not in use', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);
    
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    };
    const user = await createUserUseCase.execute(userData);

    expect(user).toHaveProperty('id')
    expect(user.name).toBe('John Doe')
    expect(user.email).toBe('john.doe@example.com')
    expect(user.role).toBe('CLIENT')
    expect(userRepository.users).toHaveLength(1)
    expect(userRepository.users[0].password).toBe('hashed-password123')
  });

  it('should not create a user when email is already in use', async () => {
    const userRepository = new FakeUserRepository();
    const passwordHasher = new FakePasswordHasher();
    const createUserUseCase = new CreateUserUseCase(userRepository, passwordHasher);

    const existingUser = User.create({
      id: '1',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'hashed-password123',
      role: 'CLIENT'
    });
    userRepository.users.push(existingUser);

    await expect(createUserUseCase.execute({
      name: 'John Doe',
      email: 'jane.doe@example.com',
      password: 'password123'
    })).rejects.toMatchObject({
      message: 'Email already in use',
      statusCode: 409,
    })

    expect(userRepository.users).toHaveLength(1)
  });
});
