export class InvalidEmailError extends Error {
  constructor(email: string) {
    super(`O email "${email}" é inválido.`)
    this.name = 'InvalidEmailError'
  }
}