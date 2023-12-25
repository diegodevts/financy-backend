import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../user-repository'
import { prismaClient } from '../../database/prisma-client'

export class UserPrismaRepository implements UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await prismaClient.user.create({ data })

    return user
  }
  async find(id: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({ where: { id } })

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prismaClient.user.findUnique({ where: { email } })

    return user
  }
  async update(
    data: Partial<Prisma.UserUncheckedUpdateInput>,
    id: string
  ): Promise<User> {
    const user = await prismaClient.user.update({ where: { id }, data })

    return user
  }
}
