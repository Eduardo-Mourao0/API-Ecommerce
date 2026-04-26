import { UserRepository } from '../../domain/repositories/userRepository'
import { PasswordHasher } from '../../domain/services/password-hasher'
import { TokenGenerator } from '../../domain/services/token-generator'

interface LoginUserRequest {
    email: string
    password: string
}

interface LoginUserResponse {
    token: string
}

export class LoginUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: PasswordHasher,
        private tokenGenerator: TokenGenerator
    ) {}

    async execute(request: LoginUserRequest): Promise<LoginUserResponse> {
        
        const user = await this.userRepository.findByEmail(request.email)

        if (!user) {
            throw new Error('Email ou senha inválidos.')
        }

        const passwordMatch = await this.passwordHasher.compare(request.password, user.password)

        if (!passwordMatch) {
            throw new Error('Email ou senha inválidos.')
        }

        const token = this.tokenGenerator.generate({
            id: user.id,
            role: user.role,
        })

        return { token }
    }
}