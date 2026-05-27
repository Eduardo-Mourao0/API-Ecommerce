import { type NextFunction, type Request, type Response } from 'express'
import { type CreateUserUseCase } from '../../../application/use-cases/user/create-user-usecase'
import { type CreateUserByAdminUseCase } from '../../../application/use-cases/user/create-user-by-admin-usecase'
import { type DeleteUserUseCase } from '../../../application/use-cases/user/delete-user'
import { type GetAllUsersUseCase } from '../../../application/use-cases/user/get-all-users-usecase'
import { type LoginUserUseCase } from '../../../application/use-cases/user/login-usecase'
import { getAuthenticatedUserId } from './http-auth'
import { createUserByAdminSchema, createUserSchema, loginUserSchema } from '../validators/user-validator'

export interface UserUseCases {
    createUser: CreateUserUseCase
    createUserByAdmin: CreateUserByAdminUseCase
    loginUser: LoginUserUseCase
    getAllUsers: GetAllUsersUseCase
    deleteUser: DeleteUserUseCase
}

export class UserController {
    constructor(private readonly userUseCases: UserUseCases) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = createUserSchema.parse(req.body)
            const user = await this.userUseCases.createUser.execute(body)

            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    async createByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = createUserByAdminSchema.parse(req.body)
            const user = await this.userUseCases.createUserByAdmin.execute(body)

            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const body = loginUserSchema.parse(req.body)
            const result = await this.userUseCases.loginUser.execute(body)

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

            res.status(200).json({
                message: 'Usuario deletado com sucesso.',
            })
        } catch (error) {
            next(error)
        }
    }
}
