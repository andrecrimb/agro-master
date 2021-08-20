import {
  FruitOrderItem,
  SeedOrderItem,
  RootstockOrderItem,
  OrderType,
  PaymentMethod,
  BorbulhaOrderItem,
  SeedlingBenchOrderItem
} from '@prisma/client'

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

export type AddRootstockOrderItem = Omit<RootstockOrderItem, 'id' | 'orderId'>

export type AddSeedOrderItem = Omit<SeedOrderItem, 'id' | 'orderId'>

export type AddBorbulhaOrderItem = Omit<BorbulhaOrderItem, 'id' | 'orderId'>

export type AddSeedlingOrderItem = Omit<SeedlingBenchOrderItem, 'id' | 'orderId'>
