export class InvalidNameError extends Error {
  constructor() {
    super(`O nome é inválido. Não pode estar vazio.`)
    this.name = 'InvalidNameError'
  }
}