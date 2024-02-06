import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredencialError } from './errors/invalid-credentials-error'

let userRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(userRepository)
  })

  it('should be able to register', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('1234', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '1234',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '1234',
      })
    ).rejects.toBeInstanceOf(InvalidCredencialError)
  })

  it('should be not be able to authenticate with wrong password', async () => {
    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('1234', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(InvalidCredencialError)
  })
})
