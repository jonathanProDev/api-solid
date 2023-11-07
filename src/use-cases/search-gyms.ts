import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymUseCases {
  query: string
  page: number
}

interface ISearchGymUseCaseRespose {
  gyms: Gym[]
}

export class SearchGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymUseCases): Promise<ISearchGymUseCaseRespose> {
    const gyms = await this.gymsRepository.serchMany(query, page)

    return {
      gyms,
    }
  }
}
