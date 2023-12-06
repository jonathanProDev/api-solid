import { checkInsRepository } from '@/repositories/check-in-repositories'
import { CheckIn } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { LateCheckInValidateError } from './errors/late-check-in-validate-error'

interface IValidateCheckInUseCaseRequest {
  checkInId: string
}

interface IValidateCheckInUseCaseResponse {
  checkIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: checkInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInUseCaseResponse> {
    console.log('chegou aq')
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutsFromCheckInCreation = dayjs(new Date()).diff(
      checkIn.created_at,
      'minutes',
    )

    if (distanceInMinutsFromCheckInCreation > 20) {
      throw new LateCheckInValidateError()
    }

    checkIn.validated_at = new Date()

    await this.checkInsRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
