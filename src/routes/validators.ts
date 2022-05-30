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

export const ownerPropertyExists: CustomValidator = (propertyId: number) => {
  return prisma.ownerProperty.findUnique({ where: { id: propertyId } }).then(property => {
    if (!property) return Promise.reject('no_property')
  })
}

export const isNewOwnerCnpj: CustomValidator = (cnpj: string) => {
  return prisma.ownerProperty.findFirst({ where: { property: { cnpj } } }).then(property => {
    if (property) return Promise.reject('cnpj_duplicated')
  })
}

export const isOwnerCnpjOrNewCnpj: CustomValidator = (cnpj: string, { req }) => {
  return prisma.ownerProperty.findFirst({ where: { property: { cnpj } } }).then(property => {
    if (property && property.id !== +req.params?.ownerPropertyId) {
      return Promise.reject('cnpj_duplicated')
    }
  })
}

export const uniqueGreenhouseOnProperty: CustomValidator = (greenhouseLabel, { req }) => {
  return prisma.greenhouse
    .findFirst({
      where: { label: greenhouseLabel, ownerPropertyId: req.body.ownerPropertyId }
    })
    .then(gh => {
      if (gh) return Promise.reject('greenhouse_already_exists')
    })
}

export const uniqueSeedlingBench: CustomValidator = (benchLabel, { req }) => {
  return prisma.seedlingBench
    .findFirst({ where: { label: benchLabel, greenhouseId: +`${req.params?.greenhouseId}` } })
    .then(bench => {
      if (bench) return Promise.reject('bench_duplicated')
    })
}

export const uniqueSeedlingBenchInGreenhouse: CustomValidator = (benchLabel, { req }) => {
  return prisma.seedlingBench
    .findFirst({ where: { label: benchLabel, greenhouseId: +`${req.params?.greenhouseId}` } })
    .then(bench => {
      if (bench && bench.id !== +req.params?.benchId) {
        return Promise.reject('bench_duplicated')
      }
    })
}

export const greenhouseExists: CustomValidator = greenhouseId => {
  return prisma.greenhouse.findFirst({ where: { id: greenhouseId } }).then(greenhouse => {
    if (!greenhouse) return Promise.reject('no_greenhouse')
  })
}

export const rootstockExists: CustomValidator = (rootstockId: number) => {
  return prisma.rootstock.findFirst({ where: { id: rootstockId } }).then(rootstock => {
    if (!rootstock) return Promise.reject('no_rootstock')
  })
}

export const isNewRootstockNameUnique: CustomValidator = (name: string) => {
  return prisma.rootstock.findUnique({ where: { name } }).then(rootstock => {
    if (rootstock) return Promise.reject('rootstock_duplicated')
  })
}

export const isRootstockNameUnique: CustomValidator = (name: string, { req }) => {
  return prisma.rootstock.findUnique({ where: { name } }).then(rootstock => {
    if (rootstock && rootstock.id !== +req.params?.rootstockId) {
      return Promise.reject('rootstock_duplicated')
    }
  })
}

export const userExists: CustomValidator = userId => {
  return prisma.user.findFirst({ where: { id: userId } }).then(user => {
    if (!user) return Promise.reject('no_user')
  })
}

export const seedlingBenchExists: CustomValidator = benchId => {
  return prisma.seedlingBench.findFirst({ where: { id: benchId } }).then(bench => {
    if (!bench) return Promise.reject('no_bench')
  })
}
