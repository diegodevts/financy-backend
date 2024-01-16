import { Product, Prisma } from '@prisma/client'
import { prismaClient } from '../../database/prisma-client'
import { NotFoundError } from '../../errors/not-found'
import { ProductRepository } from '../product-repository'

export class ProductPrismaRepository implements ProductRepository {
  async addOrUpdate(
    data: Prisma.ProductUncheckedCreateInput
  ): Promise<{ product: Product; hasProduct: Product | null }> {
    const hasProduct = await prismaClient.product.findFirst({
      where: { market_id: data.market_id, name: data.name }
    })
    const product = await prismaClient.product.upsert({
      where: { market_id: data.market_id, id: hasProduct ? hasProduct.id : 0 },
      create: { ...data },
      update: {
        ...data
      }
    })

    return { product, hasProduct: hasProduct }
  }

  async findMany(market_id: string): Promise<Product[]> {
    const products = await prismaClient.product.findMany({
      where: { market_id }
    })

    return products
  }

  async remove(id: number): Promise<void> {
    await prismaClient.product.delete({ where: { id } })
  }

  async find(id: number): Promise<Product | null> {
    const product = await prismaClient.product.findUnique({ where: { id } })

    return product
  }

  async addMany(data: Prisma.ProductUncheckedCreateInput[]): Promise<void> {
    await prismaClient.product.createMany({ data })
  }
}
