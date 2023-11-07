import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { UserAlreadyExistError } from '@/use-cases/errors/user-already-exist-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.handle({
      name,
      email,
      password,
    })
  } catch (err) {
    if (err instanceof UserAlreadyExistError) {
      return reply.status(409).send({ message: err.message })
    }

    return reply.status(500).send()
  }

  return reply.status(201).send('create')
}
