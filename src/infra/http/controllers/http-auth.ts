import { type Request } from 'express'
import { BusinessError } from '../../../domain/errors/business-error'

export function getAuthenticatedUserId(request: Request): string {
    if (!request.user?.id) {
        throw new BusinessError('Usuario nao autenticado.', 401)
    }

    return request.user.id
}
