import { ProductPrismaRepository } from '../../repositories/prisma/product'
import { ProductService } from '../../services/product-service'
import { ProductController } from './product-controller'

const productRepository = new ProductPrismaRepository()

const productService = new ProductService(productRepository)

const productController = new ProductController(productService)

export { productController }
