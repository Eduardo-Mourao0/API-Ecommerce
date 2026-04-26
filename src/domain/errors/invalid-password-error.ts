export class InvalidPasswordError extends Error {
  constructor() {
    super(`A senha deve ter no mínimo 4 caracteres.`)
    this.name = 'InvalidPasswordError'
  }
}