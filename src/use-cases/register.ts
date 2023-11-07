import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistError } from './errors/user-already-exist-error'
import { User } from '@prisma/client'

interface RegisterUseCases {
  name: string
  email: string
  password: string
}

interface IRegisterUseCaseRespose {
  user: User
}

export class RegisterUseCase {
  constructor(private userRepository: UsersRepository) {}

  async handle({
    name,
    email,
    password,
  }: RegisterUseCases): Promise<IRegisterUseCaseRespose> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistError()
    }

    const user = await this.userRepository.create({
      email,
      name,
      password_hash,
    })

    return {
      user,
    }
  }
}
