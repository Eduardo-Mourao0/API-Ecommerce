import { User } from '../../domain/entities/user'
import { UserRepository } from '../../domain/repositories/user-repository'
import { PrismaTransactionClient } from '../../domain/managers/ITransactionManager'

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly tx: PrismaTransactionClient) {}

    async create(user: User): Promise<User> {
        await this.tx.user.create({
            data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            },
        })

        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        const data = await this.tx.user.findUnique({ where: { email } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findById(id: string): Promise<User | null> {
        const data = await this.tx.user.findUnique({ where: { id } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findAll(): Promise<User[]> {
        const users = await this.tx.user.findMany()
        return users.map(User.createFromPrimitives)
    }

    async delete(id: string): Promise<void> {
        await this.tx.user.delete({ where: { id } })
    }
}