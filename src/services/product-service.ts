import { Prisma } from '@prisma/client'
import { ExpenseRepository } from '../repositories/expense-repository'
import { NotFoundError } from '../errors/not-found'
import { ProductRepository } from '../repositories/product-repository'

export class ProductService {
  constructor(private repository: ProductRepository) {}

  async addOrUpdate(data: Prisma.ProductUncheckedCreateInput) {
    const { product, hasProduct } = await this.repository.addOrUpdate(data)

    return { product, hasProduct }
  }

  async findMany(market_id: string) {
    const products = await this.repository.findMany(market_id)

    return products
  }

  async addMany(data: Prisma.ProductUncheckedCreateInput[], market_id: string) {
    await this.repository.addMany(data, market_id)
  }
}
