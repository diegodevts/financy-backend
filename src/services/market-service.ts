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
    const allMarkets = await this.repository.findMany() //colocar no redis

    if (allMarkets.length == 0) {
      const marketsCreated = await this.repository.addMany(data)

      return marketsCreated
    }

    //se houver mercado com nome repetido, mas a localização seja diferente, retorne ele
    //se houver mercado com nome diferente e localização diferente, retorne ele
    const filteredRepeatedMarkets = data.filter(
      (newMarket) =>
        !allMarkets.some(
          (market) =>
            market.name === newMarket.name &&
            market.latitude === newMarket.latitude &&
            market.longitude === newMarket.longitude
        )
    )

    const marketsCreated = await this.repository.addMany(
      filteredRepeatedMarkets
    )

    return marketsCreated
  }

  async findMany() {
    const MarketRepositorys = await this.repository.findMany()

    return MarketRepositorys
  }

  async update(data: Partial<Prisma.MarketUncheckedUpdateInput>, id: string) {
    const updatedMarket = await this.repository.update(data, id)

    return updatedMarket
  }

  async findByLocation(latitude: number, longitude: number) {
    const market = await this.repository.findByLocation(latitude, longitude)

    return market
  }
}
