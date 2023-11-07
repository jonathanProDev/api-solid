import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(prismaGymsRepository)

  return useCase
}
