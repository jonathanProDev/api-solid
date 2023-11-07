import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeCheckInsUseCase() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CheckInUseCase(prismaCheckInRepository, gymsRepository)

  return useCase
}
