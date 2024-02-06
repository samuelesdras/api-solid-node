export class InvalidCredencialError extends Error {
  constructor() {
    super('E-mail alredy exists.')
  }
}
