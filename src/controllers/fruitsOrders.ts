import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddFruitOrderItem } from '../types/order'

const addOrderItems: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        fruitOrderItems: { createMany: { data: req.body as AddFruitOrderItem[] } }
      }
    })
    res.status(201).json(order)
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

  const orderItemId = req.params.fruitOrderItemId as unknown as number

  try {
    const orderItem = await prisma.fruitOrderItem.delete({
      where: { id: orderItemId }
    })
    res.status(200).json(orderItem)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addOrderItems, deleteOrderItems }
