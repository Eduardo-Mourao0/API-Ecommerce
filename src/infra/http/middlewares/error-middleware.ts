import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { BusinessError } from '../../../domain/errors/business-error'
import { Logger } from '../../log/logger'

export async function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    
    if (error instanceof ZodError) {
        await Logger.warn('Dados invalidos.', req.path)

        res.status(400).json({
            error: 'ValidationError',
            message: 'Dados invalidos.',
            issues: error.issues.map(issue => ({
                path: issue.path.join('.'),
                message: issue.message,
            })),
        })
        return
    }

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
