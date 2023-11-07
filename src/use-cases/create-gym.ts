import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface CreateGymUseCases {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymUseCaseRespose {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async handle({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCases): Promise<ICreateGymUseCaseRespose> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}
