import { ExpensePrismaRepository } from '../../repositories/prisma/expense'
import { MarketPrismaRepository } from '../../repositories/prisma/market'
import { ExpenseService } from '../../services/expense-service'
import { MarketService } from '../../services/market-service'
import { MarketController } from './market-controller'

const marketRepository = new MarketPrismaRepository()

const marketService = new MarketService(marketRepository)

const marketController = new MarketController(marketService)

export { marketController }
