import { checkInsRepository } from '@/repositories/check-in-repositories'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { CheckIn } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordination } from '@/utils/get-distance-between-coodinations'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checkins-error'
import { MaxDistanceError } from './errors/masx-distance-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsRepository: checkInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInUseCaseRequest): Promise<ICheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordination(
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }
    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckInsError()
    }

    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    if (!checkIn) {
      throw new InvalidCredentialsError()
    }

    return {
      checkIn,
    }
  }
}
