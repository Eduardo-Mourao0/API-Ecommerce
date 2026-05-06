import { LoginUserDTO } from '../../dtos/user-dto'
import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { UserRepository } from '../../../domain/repositories/user-repository'
import { PasswordHasher } from '../../../domain/services/password-hasher'
import { TokenGenerator } from '../../../domain/services/token-generator'

interface LoginUserRequest {
    email: string
    password: string
}

type UserRepositoryFactory = (tx: PrismaTransactionClient) => UserRepository

export class LoginUserUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private userRepositoryFactory: UserRepositoryFactory,
        private passwordHasher: PasswordHasher,
        private tokenGenerator: TokenGenerator
    ) {}

    async execute(request: LoginUserRequest): Promise<LoginUserDTO> {
        return await this.transactionManager.execute(async (tx) => {
            const userRepository = this.userRepositoryFactory(tx)

            const user = await userRepository.findByEmail(request.email)

            if (!user) {
                throw new BusinessError('Email ou senha inv\u00e1lidos.', 401)
            }

            const passwordMatch = await this.passwordHasher.compare(request.password, user.password)

            if (!passwordMatch) {
                throw new BusinessError('Email ou senha inv\u00e1lidos.', 401)
            }

            const token = this.tokenGenerator.generate({
                id: user.id,
                role: user.role,
            })

            return { token }
        })
    }
}
