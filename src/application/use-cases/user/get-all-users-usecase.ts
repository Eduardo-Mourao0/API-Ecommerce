import { toUserDTO, UserDTO } from '../../dtos/user-dto'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { UserRepository } from '../../../domain/repositories/user-repository'

type UserRepositoryFactory = (tx: PrismaTransactionClient) => UserRepository

export class GetAllUsersUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private userRepositoryFactory: UserRepositoryFactory
    ) {}

    async execute(): Promise<UserDTO[]> {
        return await this.transactionManager.execute(async (tx) => {
            const userRepository = this.userRepositoryFactory(tx)
            const users = await userRepository.findAll()

            return users.map(toUserDTO)
        })
    }
}
