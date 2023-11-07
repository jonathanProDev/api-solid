import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUserRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUserRepository()
  const registerUseCase = new RegisterUseCase(prismaUsersRepository)

  return registerUseCase
}
