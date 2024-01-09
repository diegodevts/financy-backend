import { Prisma, Market } from '@prisma/client'

export interface MarketRepository {
  add(data: Prisma.MarketUncheckedCreateInput): Promise<Market>
  addMany(data: Prisma.MarketUncheckedCreateInput[]): Promise<boolean>
  find(id: string): Promise<Market | null>
  findMany(): Promise<Market[]>
  findByLocation(latitude: number, longitude: number): Promise<Market | null>
  update(
    data: Partial<Prisma.MarketUncheckedUpdateInput>,
    id: string
  ): Promise<Market>
  remove(id: string): Promise<void>
}
