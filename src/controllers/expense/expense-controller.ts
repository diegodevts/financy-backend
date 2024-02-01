import { Request, Response } from 'express'
import { ExpenseService } from '../../services/expense-service'
import { NotFoundError } from '../../errors/not-found'
import { IncorrectCredentialsError } from '../../errors/incorrect-credentials'

export class ExpenseController {
  constructor(private service: ExpenseService) {}

  async add(request: Request, response: Response) {
    try {
      const { value, type, description, user_id, date } = request.body
      const { expense } = await this.service.add({
        value: parseFloat(value),
        type,
        description,
        user_id,
        date
      })

      return response
        .status(201)
        .send({ message: 'Item adicionado com sucesso!', expense })
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async findMany(request: Request, response: Response) {
    try {
      const { user_id } = request.body
      const { month } = request.query
      const expenses = await this.service.findMany({
        user_id,
        month: month as string
      })

      return response.send({ expenses })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response
        .status(500)
        .send({ message: 'Internal server error', error })
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { id } = request.params
      const data = request.body
      await this.service.update(data, id)

      return response.send({ message: 'Item atualizado com sucesso!' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async remove(request: Request, response: Response) {
    try {
      const { id } = request.params
      await this.service.remove(id)

      return response.send({ message: 'Item removido com sucesso!' })
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
