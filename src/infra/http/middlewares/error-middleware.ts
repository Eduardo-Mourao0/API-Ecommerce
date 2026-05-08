import { Request, Response, NextFunction } from 'express'
import { BusinessError } from '../../../domain/errors/business-error'
import { Logger } from '../../log/logger'

export async function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    if (error instanceof BusinessError) {
        await Logger.warn(error.message, req.path)
        
        res.status(error.statusCode).json({
        error: error.name,
        message: error.message,
        })
        return
    }

    await Logger.error(error, req.path)

    res.status(500).json({
        error: 'InternalServerError',
        message: 'Erro interno do servidor.',
    })
}
