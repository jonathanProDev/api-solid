import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { UserAlreadyExistError } from './errors/user-already-exist-error'

let inMemoryUserRepository: InMemoryUserRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new RegisterUseCase(inMemoryUserRepository)
  })
  it('should be able to register a new user', async () => {
    const email = 'jon@hotmail.com'

    const { user } = await sut.handle({
      name: 'jonh',
      email,
      password: '123asd6',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const { user } = await sut.handle({
      name: 'jonh',
      email: 'jon@hotmail.com',
      password: '123asd6',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123asd6',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able register the same email twice', async () => {
    const email = 'jon@hotmail.com'

    await sut.handle({
      name: 'jonh',
      email,
      password: '123asd6',
    })

    await expect(
      async () =>
        await sut.handle({
          name: 'jonh',
          email,
          password: '123asd6',
        }),
    ).rejects.toBeInstanceOf(UserAlreadyExistError)
  })
})
