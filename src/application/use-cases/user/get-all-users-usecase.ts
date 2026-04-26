import { User } from "../../../domain/entities/user";
import { UserRepository } from "../../../domain/repositories/userRepository";

export class GetAllUsersUseCase {
    constructor(private userRepository: UserRepository) {}

    async execute(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}
