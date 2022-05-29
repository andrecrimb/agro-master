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

export const isNewCustomerCnpj: CustomValidator = (cnpj: string) => {
  return prisma.customerProperty.findFirst({ where: { property: { cnpj } } }).then(property => {
    if (property) return Promise.reject('cnpj_duplicated')
  })
}

export const isCustomerCnpjOrNewCnpj: CustomValidator = (cnpj: string, { req }) => {
  return prisma.customerProperty.findFirst({ where: { property: { cnpj } } }).then(property => {
    if (property && property.propertyId !== +req.params?.propertyId) {
      return Promise.reject('cnpj_duplicated')
    }
  })
}

export const isNewUserEmail: CustomValidator = (email: string) => {
  return prisma.user.findFirst({ where: { email } }).then(userFound => {
    if (userFound) return Promise.reject('email_duplicated')
  })
}

export const isUserEmailOrNewEmail: CustomValidator = (email: string, { req }) => {
  return prisma.user.findFirst({ where: { email } }).then(user => {
    if (user && user.id !== +req.params?.userId) {
      return Promise.reject('email_duplicated')
    }
  })
}
