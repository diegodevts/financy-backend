import { Request, Response } from 'express'
import { UserService } from '../../services/user-service'
import { UserAlreadyExistsError } from '../../errors/user-already-exists'
import { NotFoundError } from '../../errors/not-found'
import { IncorrectCredentialsError } from '../../errors/incorrect-credentials'

export class UserController {
  constructor(private service: UserService) {}

  async register(request: Request, response: Response) {
    try {
      await this.service.register(request.body)

      return response
        .status(201)
        .send({ message: 'Usuário registrado com sucesso!' })
    } catch (error: any) {
      if (error instanceof UserAlreadyExistsError) {
        return response.status(401).json({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async find(request: Request, response: Response) {
    try {
      const { id } = request.params
      const { name } = await this.service.find(id)

      return response.send({ message: 'Ok!', name })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params
      const data = request.body
      await this.service.update(data, id)

      return response.send({ message: 'Atualizado com sucesso!' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async login(request: Request, response: Response) {
    try {
      const { email, password } = request.body
      const { token, user } = await this.service.login(email, password)

      return response.send({
        message: `Olá novamente, ${user}!`,
        token
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      if (error instanceof IncorrectCredentialsError) {
        return response.status(401).json({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }
}
