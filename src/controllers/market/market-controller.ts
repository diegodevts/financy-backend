import { Request, Response } from 'express'
import { NotFoundError } from '../../errors/not-found'
import { IncorrectCredentialsError } from '../../errors/incorrect-credentials'
import { MarketService } from '../../services/market-service'

export class MarketController {
  constructor(private service: MarketService) {}

  async add(request: Request, response: Response) {
    try {
      const { name, description, latitude, longitude } = request.body

      const { market } = await this.service.add({
        name,
        description,
        latitude,
        longitude
      })

      return response
        .status(201)
        .send({ message: 'Mercado adicionado com sucesso!', market })
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async addMany(request: Request, response: Response) {
    try {
      const data = request.body

      const hasMarketsCreated = await this.service.addMany(data)

      return response.status(201).send({
        message: 'Mercados adicionados com sucesso!',
        hasMarketsCreated
      })
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async findMany(request: Request, response: Response) {
    try {
      const markets = await this.service.findMany()

      return response.send({ markets })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response
        .status(500)
        .send({ message: 'Internal server error', error })
    }
  }

  async findByLocation(request: Request, response: Response) {
    try {
      const { latitude, longitude } = request.params

      const market = await this.service.findByLocation(
        Number(latitude),
        Number(longitude)
      )

      return response.send({ market })
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

      return response.send({ message: 'Mercado atualizado com sucesso!' })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response.status(500).send({ message: 'Internal server error' })
    }
  }
}
