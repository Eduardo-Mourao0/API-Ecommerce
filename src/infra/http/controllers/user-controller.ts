import { type NextFunction, type Request, type Response } from 'express'
import { type UserUseCases } from '../../../application/factories/make-user-use-cases'
import { getAuthenticatedUserId } from './http-auth'

export class UserController {
    constructor(private readonly userUseCases: UserUseCases) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userUseCases.createUser.execute(req.body)

            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.userUseCases.loginUser.execute(req.body)

            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.userUseCases.getAllUsers.execute()

            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = getAuthenticatedUserId(req)

            await this.userUseCases.deleteUser.execute({ id: userId })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}
