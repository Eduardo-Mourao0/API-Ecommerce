import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaUserRepository } from '../../infra/repositories/prisma-user-repository'
import { BcryptPasswordHasher } from '../../infra/services/bcrypt-password-hasher'
import { JwtTokenGenerator } from '../../infra/services/jwt-token-generator'
import { CreateUserUseCase } from '../use-cases/user/create-user-usecase'
import { LoginUserUseCase } from '../use-cases/user/login-usecase'
import { GetAllUsersUseCase } from '../use-cases/user/get-all-users-usecase'
import { DeleteUserUseCase } from '../use-cases/user/delete-user'

export function makeUserUseCases(tx: PrismaTransactionClient) {
    const userRepository = new PrismaUserRepository(tx)
    const passwordHasher = new BcryptPasswordHasher()
    const tokenGenerator = new JwtTokenGenerator()

    return {
        createUser: new CreateUserUseCase(userRepository, passwordHasher),
        loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator),
        getAllUsers: new GetAllUsersUseCase(userRepository),
        deleteUser: new DeleteUserUseCase(userRepository),
    }
}
