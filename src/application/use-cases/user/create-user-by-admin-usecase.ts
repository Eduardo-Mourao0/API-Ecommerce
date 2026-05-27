import { toUserDTO, UserDTO } from '../../dtos/user-dto'
import { User, UserRole } from '../../../domain/entities/user'
import { BusinessError } from '../../../domain/errors/business-error'
import { UserRepository } from '../../../domain/repositories/user-repository'
import { PasswordHasher } from '../../../domain/services/password-hasher'

interface CreateUserByAdminRequest {
    name: string
    email: string
    password: string
    role: UserRole
}

export class CreateUserByAdminUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher
    ) {}

    async execute(request: CreateUserByAdminRequest): Promise<UserDTO> {
        const existingUser = await this.userRepository.findByEmail(request.email)

        if (existingUser) {
            throw new BusinessError('Email already in use', 409)
        }

        const hashedPassword = await this.passwordHasher.hash(request.password)
        const user = User.create({
            name: request.name,
            email: request.email,
            password: hashedPassword,
            role: request.role,
        })

        await this.userRepository.create(user)

        return toUserDTO(user)
    }
}
