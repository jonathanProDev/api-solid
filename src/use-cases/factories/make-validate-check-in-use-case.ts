import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const useCase = new ValidateCheckInUseCase(prismaCheckInRepository)

  return useCase
}
