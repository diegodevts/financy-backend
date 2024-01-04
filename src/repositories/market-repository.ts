import { Prisma, Market } from '@prisma/client'

export interface MarketRepository {
  add(data: Prisma.MarketUncheckedCreateInput): Promise<Market>
  find(id: string): Promise<Market | null>
  findMany(): Promise<Market[]>
  update(
    data: Partial<Prisma.MarketUncheckedUpdateInput>,
    id: string
  ): Promise<Market>
  remove(id: string): Promise<void>
}
