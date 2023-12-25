import { Prisma, Expenses } from '@prisma/client'

export interface ExpenseRepository {
  add(data: Prisma.ExpensesUncheckedCreateInput): Promise<Expenses>
  find(id: string): Promise<Expenses | null>
  findMany({
    user_id,
    month
  }: {
    user_id: string
    month: string
  }): Promise<Expenses[]>
  update(
    data: Partial<Prisma.ExpensesUncheckedUpdateInput>,
    id: string
  ): Promise<Expenses>
  remove(id: string): Promise<void>
}
