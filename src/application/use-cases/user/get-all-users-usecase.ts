import { toUserDTO, UserDTO } from '../../dtos/user-dto'
import { UserRepository } from '../../../domain/repositories/user-repository'

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(): Promise<UserDTO[]> {
        const users = await this.userRepository.findAll()

        return users.map(toUserDTO)
    }
}
