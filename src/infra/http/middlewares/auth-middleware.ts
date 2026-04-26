import { type NextFunction, type Request, type Response } from 'express'
import { BusinessError } from '../../../domain/errors/business-error'
import { type TokenGenerator } from '../../../domain/services/token-generator'
import { JwtTokenGenerator } from '../../services/jwt-token-generator'

function extractBearerToken(authorizationHeader?: string): string {
  if (!authorizationHeader) {
    throw new BusinessError('Token não informado.', 401)
  }

  const [scheme, token] = authorizationHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    throw new BusinessError('Token mal formatado.', 401)
  }

  return token
}

export function authMiddleware(tokenGenerator: TokenGenerator = new JwtTokenGenerator()) {
  return (request: Request, _response: Response, next: NextFunction): void => {
    try {
      const token = extractBearerToken(request.headers.authorization)
      const payload = tokenGenerator.verify(token)

      request.user = {
        id: payload.id,
        role: payload.role,
      }

      next()
    } catch (error) {
      if (error instanceof BusinessError) {
        next(error)
        return
      }

      next(new BusinessError('Token inválido ou expirado.', 401))
    }
  }
}
