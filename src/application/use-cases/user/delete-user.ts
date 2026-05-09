import { BusinessError } from '../../../domain/errors/business-error'
import { UserRepository } from '../../../domain/repositories/user-repository'

interface DeleteUserRequest {
    id: string
}

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(request: DeleteUserRequest): Promise<void> {
        const user = await this.userRepository.findById(request.id)

        if (!user) {
            throw new BusinessError('User not found.', 404)
        }

        await this.userRepository.delete(request.id)
    }
}
