import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { UserAlredyExistsError } from '@/use-cases/errors/user-alredy-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const regisrterBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(3),
  })

  const { name, email, password } = regisrterBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof UserAlredyExistsError) {
      reply.status(409).send({
        message: error.message,
      })
    }
    throw error
  }

  return reply.status(201).send()
}
