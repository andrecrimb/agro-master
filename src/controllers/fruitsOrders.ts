import { User } from '@prisma/client'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddFruitsOrderBody } from '../types/order'

const getFruitsOrders: RequestHandler = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        type: true,
        orderDate: true,
        deliveryDate: true,
        nfNumber: true,
        installmentsNumber: true,
        user: { select: { id: true, lastName: true, firstName: true } },
        customerProperty: {
          select: {
            customer: { select: { id: true, lastName: true, firstName: true, nickname: true } },
            property: {
              select: {
                id: true,
                producerName: true,
                name: true,
                cnpj: true,
                cpf: true,
                ie: true,
                address: true,
                zip: true,
                city: true,
                state: true,
                country: true
              }
            }
          }
        },
        payments: {
          select: { id: true, amount: true, method: true, scheduledDate: true, received: true }
        },
        fruitOrderItems: { select: { id: true, name: true, quantity: true, boxPrice: true } }
      }
    })
    return res.status(200).json(orders)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

const getFruitsOrder: RequestHandler = async (req, res) => {
  try {
    const orderId = req.params.orderId as unknown as number
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        type: true,
        orderDate: true,
        deliveryDate: true,
        nfNumber: true,
        installmentsNumber: true,
        user: { select: { id: true, lastName: true, firstName: true } },
        customerProperty: {
          select: {
            customer: { select: { id: true, lastName: true, firstName: true, nickname: true } },
            property: {
              select: {
                id: true,
                producerName: true,
                name: true,
                cnpj: true,
                cpf: true,
                ie: true,
                address: true,
                zip: true,
                city: true,
                state: true,
                country: true
              }
            }
          }
        },
        payments: {
          select: { id: true, amount: true, method: true, scheduledDate: true, received: true }
        },
        fruitOrderItems: { select: { id: true, name: true, quantity: true, boxPrice: true } }
      }
    })
    return res.status(200).json(order)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

const addFruitsOrder: RequestHandler = async (req, res) => {
  console.log('entrou!')
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const user = res.locals.user as User

  try {
    const reqBody = req.body as AddFruitsOrderBody

    console.log(reqBody)

    const customerProperty = await prisma.customerProperty.findFirst({
      where: { propertyId: reqBody.customerPropertyId }
    })

    const order = await prisma.order.create({
      data: {
        type: reqBody.type,
        orderDate: reqBody.orderDate,
        deliveryDate: reqBody.deliveryDate,
        nfNumber: reqBody.nfNumber,
        installmentsNumber: reqBody.installmentsNumber,
        userId: user.id,
        customerId: customerProperty!.customerId,
        customerPropertyId: reqBody.customerPropertyId,
        payments: { createMany: { data: reqBody.payments } },
        fruitOrderItems: { createMany: { data: reqBody.fruitOrderItems } }
      }
    })

    res.status(201).json(order)
  } catch (e) {
    console.error(e)
    res.status(e.status || 500).json(e)
  }
}

export default { getFruitsOrders, getFruitsOrder, addFruitsOrder }
