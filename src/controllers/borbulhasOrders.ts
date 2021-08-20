import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddBorbulhaOrderItem } from '../types/order'

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
        borbulhaOrderItems: { createMany: { data: req.body as AddBorbulhaOrderItem[] } }
      }
    })
    res.status(201).json(order)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const editOrderItems: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number
  const orderItemId = req.params.orderItemId as unknown as number

  try {
    const orderItem = await prisma.borbulhaOrderItem.update({
      where: { id: orderItemId },
      data: { orderId, ...(req.body as AddBorbulhaOrderItem) }
    })
    res.status(201).json(orderItem)
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
    const orderItem = await prisma.borbulhaOrderItem.delete({
      where: { id: orderItemId }
    })
    res.status(200).json(orderItem)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addOrderItems, deleteOrderItems, editOrderItems }
