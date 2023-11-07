import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const useCase = new FetchUserCheckInsHistoryUseCase(prismaCheckInRepository)

  return useCase
}
