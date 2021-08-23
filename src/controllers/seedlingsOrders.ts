import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddSeedlingOrderItem } from '../types/order'

const addOrderItems: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number
  const orderItems = req.body as AddSeedlingOrderItem[]

  try {
    /**
     * A new seedling order item was added
     * decrement the bench value from seedlingBench
     */
    const transactionResults = await prisma.$transaction([
      ...orderItems.map(orderItem =>
        prisma.seedlingBench.update({
          where: { id: orderItem.seedlingBenchId },
          data: { quantity: { decrement: orderItem.quantity } }
        })
      ),
      prisma.order.update({
        where: { id: orderId },
        data: {
          seedlingBenchOrderItems: { createMany: { data: req.body as AddSeedlingOrderItem[] } }
        }
      })
    ])

    res.status(201).json(transactionResults.pop())
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const deleteOrderItems: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const orderItemId = req.params.orderItemId as unknown as number
  try {
    const orderItem = await prisma.seedlingBenchOrderItem.findUnique({ where: { id: orderItemId } })
    if (!orderItem) return new Error('no_order_item')

    /**
     * A new seedling order item was deleted
     * increment the bench value from seedlingBench
     */
    const transactionResults = await prisma.$transaction([
      prisma.seedlingBench.update({
        where: { id: orderItem.seedlingBenchId },
        data: { quantity: { increment: orderItem.quantity } }
      }),
      prisma.seedlingBenchOrderItem.delete({
        where: { id: orderItemId }
      })
    ])

    res.status(200).json(transactionResults.pop())
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addOrderItems, deleteOrderItems }
