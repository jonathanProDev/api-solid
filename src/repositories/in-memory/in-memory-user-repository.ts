import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryUserRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find((item) => id === item.id)

    if (!user) {
      return null
    }
    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find((item) => email === item.email) || null
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      email: data.email,
      name: data.name,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)
    return user
  }
}
