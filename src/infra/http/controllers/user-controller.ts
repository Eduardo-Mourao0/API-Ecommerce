import { type NextFunction, type Request, type Response } from 'express'
import { type User } from '../../../domain/entities/user'
import { BusinessError } from '../../../domain/errors/business-error'
import { makeUserUseCases } from '../../../application/factories/make-user-use-cases'
import { PrismaTransactionManager } from '../../database/prisma/prisma-transaction-manager'

const transactionManager = new PrismaTransactionManager()

function toUserResponse(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

function getAuthenticatedUserId(request: Request): string {
    if (!request.user?.id) {
        throw new BusinessError('Usuario nao autenticado.', 401)
    }

    return request.user.id
}

export class UserController {
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await transactionManager.execute(async (tx) => {
                const { createUser } = makeUserUseCases(tx)
                return await createUser.execute(req.body)
            })

            res.status(201).json(toUserResponse(user))
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await transactionManager.execute(async (tx) => {
                const { loginUser } = makeUserUseCases(tx)
                return await loginUser.execute(req.body)
            })

            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await transactionManager.execute(async (tx) => {
                const { getAllUsers } = makeUserUseCases(tx)
                return await getAllUsers.execute()
            })

            res.status(200).json(users.map(toUserResponse))
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)

            await transactionManager.execute(async (tx) => {
                const { deleteUser } = makeUserUseCases(tx)
                return await deleteUser.execute({ id: userId })
            })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
