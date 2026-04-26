export interface TokenGenerator {
    
    generate(payload: { id: string; role: string }): string
    
    verify(token: string): { id: string; role: string }
}