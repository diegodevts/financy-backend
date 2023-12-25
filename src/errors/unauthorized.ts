export class UnauthorizedError extends Error {
  constructor(public message: string) {
    super(`Acesso não autorizado, ${message}`)
  }
}
