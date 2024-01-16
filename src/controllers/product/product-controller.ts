import { Request, Response } from 'express'
import { NotFoundError } from '../../errors/not-found'
import { ProductService } from '../../services/product-service'

export class ProductController {
  constructor(private service: ProductService) {}

  async addOrUpdate(request: Request, response: Response) {
    try {
      const { name, price, market_id } = request.body

      const { product, hasProduct } = await this.service.addOrUpdate({
        name,
        price,
        market_id
      })

      return response.status(201).send({
        message: `Produto ${
          hasProduct ? 'atualizado' : 'adicionado'
        } com sucesso!`,
        product
      })
    } catch (error) {
      return response.status(500).send({ message: 'Internal server error' })
    }
  }

  async findMany(request: Request, response: Response) {
    try {
      const { market_id } = request.params
      const products = await this.service.findMany(market_id)

      return response.send({ products })
    } catch (error) {
      if (error instanceof NotFoundError) {
        return response.status(401).send({ message: error.message })
      }

      return response
        .status(500)
        .send({ message: 'Internal server error', error })
    }
  }

  async addMany(request: Request, response: Response) {
    try {
      const data = request.body
      const { market_id } = request.params

      delete data.user_id
      await this.service.addMany(data, market_id)

      return response.status(201).send({
        message: 'Produtos adicionados com sucesso!'
      })
    } catch (error) {
      console.log(error)
      return response.status(500).send({ message: 'Internal server error' })
    }
  }
}
