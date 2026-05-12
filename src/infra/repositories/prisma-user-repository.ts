import { User } from '../../domain/entities/user'
import { UserRepository } from '../../domain/repositories/user-repository'
import { PrismaRepositoryClient } from '../database/prisma/prisma-repository-client'

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaRepositoryClient) {}

    async create(user: User): Promise<User> {
        await this.prisma.user.create({
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
        const data = await this.prisma.user.findUnique({ where: { email } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findById(id: string): Promise<User | null> {
        const data = await this.prisma.user.findUnique({ where: { id } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany()
        return users.map(User.createFromPrimitives)
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.delete({ where: { id } })
    }
}
