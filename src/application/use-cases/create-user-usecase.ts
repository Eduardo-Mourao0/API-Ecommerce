import { UserRepository } from '../../domain/repositories/userRepository'
import { User, UserRole } from '../../domain/entities/user'
import { PasswordHasher } from '../../domain/services/password-hasher';

interface CreateUserRequest {
    name: string
    email: string
    password: string
    role?: UserRole
}

export class CreateUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher
    ) {}

    async execute(request: CreateUserRequest): Promise<User> {
        
        const existingUser = await this.userRepository.findByEmail(request.email);

        if(existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await this.passwordHasher.hash(request.password)

        const user = User.create({ ...request, password: hashedPassword })

        await this.userRepository.create(user);

        return user
    }
}   