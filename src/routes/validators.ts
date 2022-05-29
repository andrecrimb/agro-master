import { CustomValidator } from 'express-validator'
import prisma from '../client'

export const orderNotCanceled: CustomValidator = (id: number) => {
  return prisma.order.findUnique({ where: { id } }).then(order => {
    if (!order) return Promise.reject('order_not_found')
    if (order.status !== 'issued') return Promise.reject('order_already_cancelled')
  })
}

export const customerPropertyExists: CustomValidator = (propertyId: number) => {
  return prisma.customerProperty.findFirst({ where: { propertyId } }).then(property => {
    if (!property) return Promise.reject('property_not_found')
  })
}
