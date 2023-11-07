import { SearchGymUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymUseCase(prismaGymsRepository)

  return useCase
}
