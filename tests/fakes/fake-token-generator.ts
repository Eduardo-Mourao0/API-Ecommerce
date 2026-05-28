import { TokenGenerator } from '../../src/domain/services/token-generator'

export class FakeTokenGenerator implements TokenGenerator {
    generate(payload: { id: string; role: string }): string {
        return `token-${payload.id}-${payload.role}`
    }

    verify(_token: string): { id: string; role: string } {
        return {
            id: 'any-id',
            role: 'CLIENT',
        }
    }
}
