import { CreateUserUseCase } from '../../../application/use-cases/user/create-user-usecase'
import { CreateUserByAdminUseCase } from '../../../application/use-cases/user/create-user-by-admin-usecase'
import { DeleteUserUseCase } from '../../../application/use-cases/user/delete-user'
import { GetAllUsersUseCase } from '../../../application/use-cases/user/get-all-users-usecase'
import { LoginUserUseCase } from '../../../application/use-cases/user/login-usecase'
import { prisma } from '../../database/prisma/prisma-client'
import { PrismaUserRepository } from '../../repositories/prisma-user-repository'
import { BcryptPasswordHasher } from '../../services/bcrypt-password-hasher'
import { JwtTokenGenerator } from '../../services/jwt-token-generator'
import { UserController } from '../controllers/user-controller'

export function makeUserController(): UserController {
    const userRepository = new PrismaUserRepository(prisma)
    const passwordHasher = new BcryptPasswordHasher()
    const tokenGenerator = new JwtTokenGenerator()

    return new UserController({
        createUser: new CreateUserUseCase(userRepository, passwordHasher),
        createUserByAdmin: new CreateUserByAdminUseCase(userRepository, passwordHasher),
        loginUser: new LoginUserUseCase(userRepository, passwordHasher, tokenGenerator),
        getAllUsers: new GetAllUsersUseCase(userRepository),
        deleteUser: new DeleteUserUseCase(userRepository),
    })
}
