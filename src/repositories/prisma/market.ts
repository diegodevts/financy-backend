import { Market, Prisma } from '@prisma/client'
import { prismaClient } from '../../database/prisma-client'
import { NotFoundError } from '../../errors/not-found'
import { formatValue } from '../../util/format-value'
import { MarketRepository } from '../market-repository'

export class MarketPrismaRepository implements MarketRepository {
  async add(data: Prisma.MarketUncheckedCreateInput): Promise<Market> {
    const market = await prismaClient.market.create({ data })

    return market
  }

  async findMany(): Promise<Market[]> {
    const markets = await prismaClient.market.findMany()

    return markets
  }

  async update(
    data: Partial<Prisma.MarketUncheckedUpdateInput>,
    id: string
  ): Promise<Market> {
    const hasMarket = await prismaClient.market.findUnique({ where: { id } })

    if (!hasMarket) {
      throw new NotFoundError('Mercado')
    }

    const market = await prismaClient.market.update({
      where: { id },
      data
    })

    return market
  }

  async remove(id: string): Promise<void> {
    await prismaClient.market.delete({ where: { id } })
  }

  async find(id: string): Promise<Market | null> {
    const market = await prismaClient.market.findUnique({ where: { id } })

    return market
  }
}
