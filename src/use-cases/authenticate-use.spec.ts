import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUserRepository: InMemoryUserRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new AuthenticateUseCase(inMemoryUserRepository)
  })
  it('should be able to authenticate', async () => {
    const email = 'jon@hotmail.com'

    await inMemoryUserRepository.create({
      name: 'jonathan',
      email,
      password_hash: await hash('123asd6', 6),
    })

    const { user } = await sut.execute({
      email,
      password: '123asd6',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate', async () => {
    const email = 'jon@hotmail.com'

    expect(() =>
      sut.execute({
        email,
        password: '123asd6',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const email = 'jon@hotmail.com'

    await inMemoryUserRepository.create({
      name: 'jonathan',
      email,
      password_hash: await hash('123asd6', 6),
    })
    await expect(() =>
      sut.execute({
        email,
        password: '123asd6s',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
