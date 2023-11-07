import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearByParams } from '../gyms-repository'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordination } from '@/utils/get-distance-between-coodinations'

export class InMemoryGymsRepository implements GymsRepository {
  async serchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.title.includes(query))
      .slice((page - 1) * 20, page * 20)
  }

  async findById(id: string) {
    const gym = this.items.find((item) => id === item.id)

    if (!gym) {
      return null
    }
    return gym
  }

  async findManyNearBy(params: findManyNearByParams) {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordination(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      )

      return distance < 10
    })
  }

  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)
    return gym
  }
}
