import * as jwt from 'jsonwebtoken'
import { TokenGenerator } from '../../domain/services/token-generator'

const EXPIRES_IN = '7d'

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET?.trim()

    if (!secret) {
        throw new Error('JWT_SECRET não configurado.')
    }

    return secret
}

export class JwtTokenGenerator implements TokenGenerator {
    private readonly secret: string

    constructor(secret: string = getJwtSecret()) {
        this.secret = secret
    }

    generate(payload: { id: string; role: string }): string {
        return jwt.sign(payload, this.secret, { expiresIn: EXPIRES_IN })
    }

    verify(token: string): { id: string; role: string } {
        return jwt.verify(token, this.secret) as { id: string; role: string }
    }
}