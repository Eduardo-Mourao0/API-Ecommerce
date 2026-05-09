import { prisma } from '../../infra/database/prisma/prisma-client'
import { PrismaUserRepository } from '../../infra/repositories/prisma-user-repository'
import { BcryptPasswordHasher } from '../../infra/services/bcrypt-password-hasher'
import { JwtTokenGenerator } from '../../infra/services/jwt-token-generator'
import { CreateUserUseCase } from '../use-cases/user/create-user-usecase'
import { DeleteUserUseCase } from '../use-cases/user/delete-user'
import { GetAllUsersUseCase } from '../use-cases/user/get-all-users-usecase'
import { LoginUserUseCase } from '../use-cases/user/login-usecase'


export function makeUserUseCases() {
    const userRepository = new PrismaUserRepository(prisma)
    const passwordHasher = new BcryptPasswordHasher()
    const tokenGenerator = new JwtTokenGenerator()

    return {
        createUser: new CreateUserUseCase(userRepository, passwordHasher),
        loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator),
        getAllUsers: new GetAllUsersUseCase(userRepository),
        deleteUser: new DeleteUserUseCase(userRepository),
    }
}

export type UserUseCases = ReturnType<typeof makeUserUseCases>
