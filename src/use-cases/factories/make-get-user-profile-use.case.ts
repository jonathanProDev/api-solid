import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { GetUserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUserRepository()
  const useCase = new GetUserProfileUseCase(prismaUsersRepository)

  return useCase
}
