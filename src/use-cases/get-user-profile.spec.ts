import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-user-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryUserRepository: InMemoryUserRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    sut = new GetUserProfileUseCase(inMemoryUserRepository)
  })

  it('should be able to get user profile', async () => {
    const email = 'jon@hotmail.com'

    const createdUser = await inMemoryUserRepository.create({
      name: 'jonathan',
      email,
      password_hash: await hash('123asd6', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('jonathan')
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
