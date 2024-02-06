export class UserAlredyExistsError extends Error {
  constructor() {
    super('Email alredy exists.')
  }
}
