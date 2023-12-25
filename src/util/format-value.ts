import { Expenses } from '@prisma/client'

export const formatValue = (value: number, type: number, item: Expenses) => {
  if (value == 0 && type == item.type) {
    return item.value
  }
  if (type > 1 && value > 0) {
    return Math.abs(value)
  }

  if (type == 1 && value > 0) {
    return (value *= -1)
  }

  if (value == 0 && type == 1) {
    return (item.value *= -1)
  }

  if (value == 0 && type > 1) {
    return Math.abs(item.value)
  }

  if (type == 0 && value == 0) {
    return item.value
  }

  if (type == 0 && value > 0) {
    return item.type == 1 ? (value *= -1) : value
  }
}
