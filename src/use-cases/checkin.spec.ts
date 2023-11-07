import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error'
import { MaxDistanceError } from './errors/masx-distance-error'

let checkInsRepository: InMemoryCheckInRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInRepository()
    gymRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymRepository)

    await gymRepository.create({
      id: 'gym-1',
      title: 'JavaScript Gym',
      description: 'Academia 1',
      phone: '61999999999',
      latitude: -15.8066746,
      longitude: -47.947488,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -15.8066746,
      userLongitude: -47.947488,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check-in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -15.8066746,
      userLongitude: -47.947488,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-1',
        userId: 'user-1',
        userLatitude: -15.8066746,
        userLongitude: -47.947488,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should  be able to check-in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -15.8066746,
      userLongitude: -47.947488,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 9, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-1',
      userId: 'user-1',
      userLatitude: -15.8066746,
      userLongitude: -47.947488,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymRepository.items.push({
      id: 'gym-2',
      title: 'JavaScript Gym',
      description: 'Academia 1',
      phone: '61999999999',
      latitude: new Decimal(-15.7893679),
      longitude: new Decimal(-47.9255941),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-2',
        userId: 'user-1',
        userLatitude: -15.8066746,
        userLongitude: -47.947488,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
