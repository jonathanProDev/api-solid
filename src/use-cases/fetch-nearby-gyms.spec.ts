import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearByGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearByGymsUseCase

describe('Fetch nearBy By Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearByGymsUseCase(gymsRepository)
  })

  it('should be able to fetch naarby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: 'Academia 1',
      phone: '61999999999',
      latitude: -15.8066746,
      longitude: -47.947488,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: 'Academia 2',
      phone: '61999999999',
      latitude: -15.811827,
      longitude: -48.096493,
    })

    const { gyms } = await sut.execute({
      userLatitude: -15.8066746,
      userLongitude: -47.947488,
    })
    // -15.811827, -48.096493
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
