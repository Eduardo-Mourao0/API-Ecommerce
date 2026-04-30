import { UserRepository } from '../../../domain/repositories/user-repository'
import { User, UserRole } from '../../../domain/entities/user'
import { PasswordHasher } from '../../../domain/services/password-hasher';
import { BusinessError } from '../../../domain/errors/business-error';

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
            throw new BusinessError('Email already in use', 409);
        }

        const hashedPassword = await this.passwordHasher.hash(request.password)

        const user = User.create({ ...request, password: hashedPassword })

        await this.userRepository.create(user);

        return user
    }
}   
