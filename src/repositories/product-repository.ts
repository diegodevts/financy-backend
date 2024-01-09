import { Prisma, Product } from '@prisma/client'

export interface ProductRepository {
  addOrUpdate(
    data: Prisma.ProductUncheckedCreateInput
  ): Promise<{ product: Product; hasProduct: Product | null }>
  find(id: number): Promise<Product | null>
  findMany(market_id: string): Promise<Product[]>
  remove(id: number): Promise<void>
}
