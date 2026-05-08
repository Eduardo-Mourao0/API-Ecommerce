import { type NextFunction, type Request, type Response } from 'express'
import { BusinessError } from '../../../domain/errors/business-error'

export function roleMiddleware(allowedRoles: string[]) {
    return (request: Request, _response: Response, next: NextFunction): void => {
        const userRole = request.user?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
            next(new BusinessError('Acesso negado.', 403))
            return
        }

        next()
    }
}
