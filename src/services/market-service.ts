import { Prisma } from '@prisma/client'
import { ExpenseRepository } from '../repositories/expense-repository'
import { NotFoundError } from '../errors/not-found'
import { MarketRepository } from '../repositories/market-repository'

export class MarketService {
  constructor(private repository: MarketRepository) {}

  async add(data: Prisma.MarketUncheckedCreateInput) {
    const market = await this.repository.add(data)

    return { market }
  }

  async addMany(data: Prisma.MarketUncheckedCreateInput[]) {
    const markets = await this.repository.findMany() //coloca no redis
    const marketsCreated = await this.repository.addMany(data)

    return markets
  }

  async findMany() {
    const MarketRepositorys = await this.repository.findMany()

    return MarketRepositorys
  }

  async update(data: Partial<Prisma.MarketUncheckedUpdateInput>, id: string) {
    const updatedMarket = await this.repository.update(data, id)

    return updatedMarket
  }
}
