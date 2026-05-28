import { User } from '../../src/domain/entities/user'
import { UserRepository } from '../../src/domain/repositories/user-repository'

export class FakeUserRepository implements UserRepository {
    public users: User[] = []

    async create(user: User): Promise<User> {
        this.users.push(user)
        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.users.find(user => user.email === email) || null
    }

    async findById(id: string): Promise<User | null> {
        return this.users.find(user => user.id === id) || null
    }

    async findAll(): Promise<User[]> {
        return this.users
    }

    async delete(id: string): Promise<void> {
        this.users = this.users.filter(user => user.id !== id)
    }
}
