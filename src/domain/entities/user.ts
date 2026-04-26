import { v4 as uuidv4 } from 'uuid'
import { InvalidNameError } from '../errors/invalid-name-error'
import { InvalidEmailError } from '../errors/invalid-email-error'
import { InvalidPasswordError } from '../errors/invalid-password-error'

export type UserRole = 'ADMIN' | 'CLIENT'

interface UserProps {
    id?: string
    name: string
    email: string
    password: string
    role?: UserRole
    createdAt?: Date
}

export class User {
    public readonly id: string
    public name: string
    public email: string
    public password: string
    public role: UserRole
    public readonly createdAt: Date

    constructor(props: UserProps) {
        this.id = props.id ?? uuidv4()
        this.name = props.name
        this.email = props.email
        this.password = props.password
        this.role = props.role ?? 'CLIENT'
        this.createdAt = props.createdAt ?? new Date()
    }

    static create(props: UserProps): User {
    
        if (!props.name || props.name.trim().length === 0) {
            throw new InvalidNameError();
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        
        if (!props.email || !emailRegex.test(props.email)) {
            throw new InvalidEmailError(props.email);
        }

        if (!props.password || props.password.length < 4) {
            throw new InvalidPasswordError();
        }

        return new User(props)
    }
    
    static createFromPrimitives(data: {
        id: string
        name: string
        email: string
        password: string
        role: UserRole
        createdAt: Date
    }): User {
        return new User(data)
    }
}