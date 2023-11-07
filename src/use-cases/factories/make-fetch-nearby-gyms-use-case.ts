import { FetchNearByGymsUseCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const useCase = new FetchNearByGymsUseCase(prismaGymsRepository)

  return useCase
}
