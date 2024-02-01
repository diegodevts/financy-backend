import { Expenses, Prisma, User } from '@prisma/client'
import { ExpenseRepository } from '../expense-repository'
import { prismaClient } from '../../database/prisma-client'
import { NotFoundError } from '../../errors/not-found'
import { formatValue } from '../../util/format-value'

export class ExpensePrismaRepository implements ExpenseRepository {
  async add({
    type,
    user_id,
    description,
    value,
    date
  }: Prisma.ExpensesUncheckedCreateInput & {
    date: string
  }): Promise<Expenses> {
    const [day, month, year] = date ? date.split('/') : ''
    const [hour, minute, second] = [
      new Date().getHours(),
      new Date().getMinutes(),
      new Date().getSeconds()
    ]
    const formattedDate = new Date(
      +year,
      +month - 1,
      +day,
      hour,
      minute,
      second
    )
    const currentMonth = new Date().getMonth()
    const hasSalary = await prismaClient.expenses.findMany({
      where: { user_id, type: 3 }
    })

    const currentMonthSalary = hasSalary.find(
      ({ created_at }) => created_at.getMonth() == currentMonth
    )

    if (currentMonthSalary && +type == 3) {
      const expense = await prismaClient.expenses.update({
        where: { id: currentMonthSalary.id },
        data: {
          value: { increment: +value }
        }
      })

      return expense
    }

    const expense = await prismaClient.expenses.create({
      data: {
        description: +type === 3 ? 'Salário' : description,
        value: type > 1 ? value : (value *= -1),
        type: +type,
        user_id,
        created_at:
          formattedDate.toString() != 'Invalid Date' ? formattedDate : undefined
      }
    })

    return expense
  }

  async findMany({
    user_id,
    month
  }: {
    user_id: string
    month: string
  }): Promise<Expenses[]> {
    const currentMonth = new Date().getMonth()

    const expenses = await prismaClient.expenses.findMany({
      where: { user_id }
    })

    const expensesByMonth = expenses.filter((expense) =>
      month
        ? expense.created_at.getMonth() == +month
        : expense.created_at.getMonth() == currentMonth
    )

    return expensesByMonth
  }

  async update(
    {
      user_id,
      type,
      description,
      value
    }: Partial<Prisma.ExpensesUncheckedUpdateInput>,
    id: string
  ): Promise<Expenses> {
    const item = await prismaClient.expenses.findUnique({ where: { id } })

    if (!item) {
      throw new NotFoundError('Item')
    }

    const formatDescription = description ? description : item.description

    const expense = await prismaClient.expenses.update({
      where: { user_id: user_id as string, id },
      data: {
        description:
          item.description == 'Salário' ? item.description : formatDescription,
        value: formatValue(value ? +value : 0, type ? +type : 0, item),
        type: type ? +type : item.type
      }
    })

    return expense
  }

  async remove(id: string): Promise<void> {
    await prismaClient.expenses.delete({ where: { id } })
  }

  async find(id: string): Promise<Expenses | null> {
    const expense = await prismaClient.expenses.findUnique({ where: { id } })

    return expense
  }
}
