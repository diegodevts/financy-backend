import { Prisma } from '@prisma/client'
import { UserRepository } from '../repositories/user-repository'
import { compare, hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists'
import { NotFoundError } from '../errors/not-found'
import { IncorrectCredentialsError } from '../errors/incorrect-credentials'
import { sign } from 'jsonwebtoken'
export class UserService {
  constructor(private repository: UserRepository) {}

  async register({ email, password, name }: Prisma.UserCreateInput) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.repository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.repository.create({
      email,
      password: password_hash,
      name
    })

    return { user }
  }

  async find(id: string) {
    const hasUser = await this.repository.find(id)

    if (!hasUser) {
      throw new NotFoundError('Usuário')
    }

    return hasUser
  }

  async update(data: Partial<Prisma.UserUncheckedCreateInput>, id: string) {
    const hasUser = await this.repository.find(id)

    if (!hasUser) {
      throw new NotFoundError('Usuário')
    }

    const updatedUser = await this.repository.update(data, id)

    return updatedUser
  }

  async login(email: string, password: string) {
    const hasUser = await this.repository.findByEmail(email)

    const secret = process.env.SECRET as string

    if (!hasUser) {
      throw new NotFoundError('Usuário não existe.')
    }

    const passwordMatches = await compare(password, hasUser.password)

    if (!passwordMatches) {
      throw new IncorrectCredentialsError()
    }

    const token = sign({ id: hasUser.id }, secret, {
      expiresIn: '1h'
    })

    return {
      token,
      user: hasUser.name
    }
  }

  //integraçao nubank
}
