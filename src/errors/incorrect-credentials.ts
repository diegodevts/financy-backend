export class IncorrectCredentialsError extends Error {
  constructor() {
    super('Email ou senha incorretos.')
  }
}
