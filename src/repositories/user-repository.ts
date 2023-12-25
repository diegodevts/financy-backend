import { Prisma, User } from '@prisma/client'

export interface UserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  find(id: string): Promise<User | null>
  update(
    data: Partial<Prisma.UserUncheckedUpdateInput>,
    id: string
  ): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
