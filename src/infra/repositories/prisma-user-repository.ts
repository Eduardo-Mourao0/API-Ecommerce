import { User } from '../../domain/entities/user'
import { UserRepository } from '../../domain/repositories/user-repository'
import { PrismaClient } from '@prisma/client'

export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prismaClient: PrismaClient) {}

    async create(user: User): Promise<User> {
        await this.prismaClient.user.create({
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
        const data = await this.prismaClient.user.findUnique({ where: { email } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findById(id: string): Promise<User | null> {
        const data = await this.prismaClient.user.findUnique({ where: { id } })
        if (!data) return null
        return User.createFromPrimitives(data)
    }

    async findAll(): Promise<User[]> {
        const users = await this.prismaClient.user.findMany()
        return users.map(User.createFromPrimitives)
    }

    async delete(id: string): Promise<void> {
        await this.prismaClient.user.delete({ where: { id } })
    }
}