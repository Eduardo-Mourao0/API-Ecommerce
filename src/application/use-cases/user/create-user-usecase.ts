import { toUserDTO, UserDTO } from '../../dtos/user-dto'
import { User, UserRole } from '../../../domain/entities/user'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { UserRepository } from '../../../domain/repositories/user-repository'
import { PasswordHasher } from '../../../domain/services/password-hasher'

interface CreateUserRequest {
    name: string
    email: string
    password: string
    role?: UserRole
}

type UserRepositoryFactory = (tx: PrismaTransactionClient) => UserRepository

export class CreateUserUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private userRepositoryFactory: UserRepositoryFactory,
        private passwordHasher: PasswordHasher
    ) {}

    async execute(request: CreateUserRequest): Promise<UserDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const userRepository = this.userRepositoryFactory(tx)

            const existingUser = await userRepository.findByEmail(request.email)

            if (existingUser) {
                throw new BusinessError('Email already in use', 409)
            }

            const hashedPassword = await this.passwordHasher.hash(request.password)
            const user = User.create({
                name: request.name,
                email: request.email,
                password: hashedPassword,
                role: 'CLIENT',
            })

            await userRepository.create(user)

            return toUserDTO(user)
        })
    }
}
