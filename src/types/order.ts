import { OrderType, PaymentMethod } from '@prisma/client'

export type AddFruitsOrderBody = {
  type: keyof typeof OrderType
  orderDate: Date
  deliveryDate: Date
  nfNumber: string
  installmentsNumber: number
  customerPropertyId: number
  payments: {
    amount: number
    method: keyof typeof PaymentMethod
    scheduledDate: Date
    received: boolean
  }[]
  fruitOrderItems: {
    name: string
    quantity: number
    boxPrice: number
  }[]
}

export type AddOrderPayment = {
  amount: number
  method: keyof typeof PaymentMethod
  scheduledDate: Date
  received: boolean
}

// export type AddFruitsOrderBody = Omit<Order, CreationIgnoreKeys> & {}
