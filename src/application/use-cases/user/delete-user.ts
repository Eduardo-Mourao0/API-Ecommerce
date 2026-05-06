import { BusinessError } from '../../../domain/errors/business-error'
import { ITransactionManager, PrismaTransactionClient } from '../../../domain/managers/ITransactionManager'
import { UserRepository } from '../../../domain/repositories/user-repository'

interface DeleteUserRequest {
    id: string
}

type UserRepositoryFactory = (tx: PrismaTransactionClient) => UserRepository

export class DeleteUserUseCase {
    constructor(
        private transactionManager: ITransactionManager,
        private userRepositoryFactory: UserRepositoryFactory
    ) {}

    async execute(request: DeleteUserRequest): Promise<void> {
        await this.transactionManager.execute(async (tx) => {
            const userRepository = this.userRepositoryFactory(tx)
            const user = await userRepository.findById(request.id)

            if (!user) {
                throw new BusinessError('User not found.', 404)
            }

            await userRepository.delete(request.id)
        })
    }
}
