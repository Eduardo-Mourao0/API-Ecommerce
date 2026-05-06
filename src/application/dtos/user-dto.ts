import { User, UserRole } from '../../domain/entities/user'

export interface UserDTO {
    id: string
    name: string
    email: string
    role: UserRole
}

export interface LoginUserDTO {
    token: string
}

export function toUserDTO(user: User): UserDTO {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}
