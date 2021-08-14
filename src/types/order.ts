import { FruitOrderItem, OrderType, PaymentMethod } from '@prisma/client'

export type OrderRequest = {
  type: keyof typeof OrderType
  orderDate: Date
  deliveryDate: Date
  nfNumber: string
  customerPropertyId: number
}

export type AddOrderPayment = {
  amount: number
  method: keyof typeof PaymentMethod
  scheduledDate: Date
  received: boolean
}

export type AddFruitOrderItem = Omit<FruitOrderItem, 'id' | 'orderId'>
