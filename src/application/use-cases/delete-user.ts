import { UserRepository } from '../../domain/repositories/userRepository'

interface DeleteUserRequest {
    id: string
}

export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(request: DeleteUserRequest): Promise<void> {
        
        const user = await this.userRepository.findById(request.id)

        if (!user) {
            throw new Error('User not found.')
        }

        await this.userRepository.delete(request.id)
    }
}