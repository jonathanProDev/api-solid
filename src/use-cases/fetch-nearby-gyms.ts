import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface fetchNearByGymsUseCases {
  userLatitude: number
  userLongitude: number
}

interface IfetchNearByGymsUseCaseRespose {
  gyms: Gym[]
}

export class FetchNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: fetchNearByGymsUseCases): Promise<IfetchNearByGymsUseCaseRespose> {
    const gyms = await this.gymsRepository.findManyNearBy({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}
