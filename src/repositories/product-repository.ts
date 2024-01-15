import { Prisma, Product } from '@prisma/client'

export interface ProductRepository {
  addOrUpdate(
    data: Prisma.ProductUncheckedCreateInput
  ): Promise<{ product: Product; hasProduct: Product | null }>
  find(id: number): Promise<Product | null>
  findMany(market_id: string): Promise<Product[]>
  addMany(
    data: Prisma.ProductUncheckedCreateInput[],
    market_id: string
  ): Promise<void>
  remove(id: number): Promise<void>
}
