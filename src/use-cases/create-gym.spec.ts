import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let GymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    GymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(GymsRepository)
  })
  it('should be able to create a new gym', async () => {
    const { gym } = await sut.handle({
      title: 'JavaScript Gym',
      description: 'Academia 1',
      phone: '61999999999',
      latitude: -15.8066746,
      longitude: -47.947488,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
