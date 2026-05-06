import { ITransactionManager, PrismaTransactionClient } from '../../domain/managers/ITransactionManager'
import { PrismaTransactionManager } from '../../infra/database/prisma/prisma-transaction-manager'
import { PrismaUserRepository } from '../../infra/repositories/prisma-user-repository'
import { BcryptPasswordHasher } from '../../infra/services/bcrypt-password-hasher'
import { JwtTokenGenerator } from '../../infra/services/jwt-token-generator'
import { CreateUserUseCase } from '../use-cases/user/create-user-usecase'
import { DeleteUserUseCase } from '../use-cases/user/delete-user'
import { GetAllUsersUseCase } from '../use-cases/user/get-all-users-usecase'
import { LoginUserUseCase } from '../use-cases/user/login-usecase'

export function makeUserUseCases(
    transactionManager: ITransactionManager = new PrismaTransactionManager()
) {
    const userRepositoryFactory = (tx: PrismaTransactionClient) => new PrismaUserRepository(tx)
    const passwordHasher = new BcryptPasswordHasher()
    const tokenGenerator = new JwtTokenGenerator()

    return {
        createUser: new CreateUserUseCase(transactionManager, userRepositoryFactory, passwordHasher),
        loginUser: new LoginUserUseCase(transactionManager, userRepositoryFactory, passwordHasher, tokenGenerator),
        getAllUsers: new GetAllUsersUseCase(transactionManager, userRepositoryFactory),
        deleteUser: new DeleteUserUseCase(transactionManager, userRepositoryFactory),
    }
}

export type UserUseCases = ReturnType<typeof makeUserUseCases>
