import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '@/use-cases/authenticate'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return authenticateUseCase
}
