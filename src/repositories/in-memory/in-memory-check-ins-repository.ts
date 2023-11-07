import { CheckIn, Prisma } from '@prisma/client'
import { checkInsRepository } from '../check-in-repositories'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInRepository implements checkInsRepository {
  async countByUserId(userId: string) {
    const count = this.items.filter((checkIn) => checkIn.user_id === userId)

    return count.length
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) {
      return null
    }

    return checkInOnSameDate
  }

  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const findIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (findIndex >= 0) {
      this.items[findIndex] = checkIn
    }

    return checkIn
  }
}
