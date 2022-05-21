import { OrderType, Prisma, User } from '@prisma/client'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { OrderRequest } from '../types/order'
import { getErrorResponse } from '../utils'

const orderSelect: Prisma.OrderSelect = {
  id: true,
  type: true,
  orderDate: true,
  deliveryDate: true,
  nfNumber: true,
  status: true,
  user: { select: { id: true, name: true } },
  customerProperty: {
    select: {
      customer: { select: { id: true, name: true, nickname: true } },
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
    select: {
      id: true,
      orderId: true,
      amount: true,
      method: true,
      scheduledDate: true,
      received: true
    }
  },
  fruitOrderItems: {
    select: { id: true, orderId: true, name: true, quantity: true, boxPrice: true }
  },
  seedOrderItems: {
    select: { id: true, orderId: true, name: true, quantity: true, kgPrice: true }
  },
  rootstockOrderItems: {
    select: {
      id: true,
      orderId: true,
      rootstockId: true,
      rootstock: { select: { name: true } },
      quantity: true,
      unityPrice: true
    }
  },
  borbulhaOrderItems: {
    select: {
      id: true,
      orderId: true,
      name: true,
      quantity: true,
      unityPrice: true,
      greenhouseId: true,
      greenhouse: {
        select: {
          label: true,
          ownerProperty: { select: { property: { select: { name: true } } } }
        }
      }
    }
  },
  seedlingBenchOrderItems: {
    select: {
      id: true,
      orderId: true,
      seedlingBenchId: true,
      seedlingBench: {
        select: {
          label: true,
          rootstock: { select: { name: true } },
          greenhouse: { select: { label: true, ownerPropertyId: true } }
        }
      },
      quantity: true,
      unityPrice: true
    }
  }
}

const getOrders: RequestHandler = async (req, res) => {
  try {
    const orderType = req.query.type as keyof typeof OrderType | undefined

    const orders = await prisma.order.findMany({
      where: orderType !== undefined ? { type: orderType } : {},
      select: orderSelect
    })
    return res.status(200).json(orders)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const getOrder: RequestHandler = async (req, res) => {
  try {
    const orderId = req.params.orderId as unknown as number
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: orderSelect
    })
    return res.status(200).json(order)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const addOrder: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const user = res.locals.user as User

  try {
    const reqBody = req.body as OrderRequest

    const customerProperty = await prisma.customerProperty.findFirst({
      where: { propertyId: reqBody.customerPropertyId }
    })

    const order = await prisma.order.create({
      data: {
        type: reqBody.type,
        orderDate: reqBody.orderDate,
        deliveryDate: reqBody.deliveryDate,
        nfNumber: reqBody.nfNumber,
        userId: user.id,
        customerId: customerProperty!.customerId,
        customerPropertyId: reqBody.customerPropertyId
      }
    })

    res.status(201).json(order)
  } catch (e) {
    console.error(e)
    res.status(500).json(getErrorResponse(e))
  }
}

const editOrder: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const orderId = req.params.orderId as unknown as number
    const reqBody = req.body as Omit<OrderRequest, 'type'>

    const customerProperty = await prisma.customerProperty.findFirst({
      where: { propertyId: reqBody.customerPropertyId }
    })

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderDate: reqBody.orderDate,
        deliveryDate: reqBody.deliveryDate,
        nfNumber: reqBody.nfNumber,
        customerId: customerProperty!.customerId,
        customerPropertyId: reqBody.customerPropertyId
      }
    })

    res.status(201).json(order)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const cancelOrder: RequestHandler = async (req, res) => {
  try {
    const orderId = req.params.orderId as unknown as number

    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { seedlingBenchOrderItems: true }
    })
    if (!order) return new Error('no_order')

    const transactionResults = await prisma.$transaction([
      /**
       * order type seedling and has bench items
       * put values back into seedlingBench
       */
      ...(order.type === 'seedling' && order.seedlingBenchOrderItems.length
        ? [
            ...order.seedlingBenchOrderItems.map(benchOrderItem =>
              prisma.seedlingBench.update({
                where: { id: benchOrderItem.seedlingBenchId },
                data: { quantity: { increment: benchOrderItem.quantity } }
              })
            ),
            ...order.seedlingBenchOrderItems.map(benchOrderItem =>
              prisma.seedlingBenchOrderItem.delete({ where: { id: benchOrderItem.id } })
            )
          ]
        : []),
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'canceled' }
      })
    ])

    res.status(200).json(transactionResults.pop())
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

export default { addOrder, editOrder, getOrder, getOrders, cancelOrder }
