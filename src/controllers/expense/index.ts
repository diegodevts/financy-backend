import { ExpensePrismaRepository } from '../../repositories/prisma/expense'
import { ExpenseService } from '../../services/expense-service'
import { ExpenseController } from './expense-controller'

const expenseRepository = new ExpensePrismaRepository()

const expenseService = new ExpenseService(expenseRepository)

const expenseController = new ExpenseController(expenseService)

export { expenseController }
