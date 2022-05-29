import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddFruitOrderItem } from '../types/order'
import { responseError } from '../utils'

const addOrderItems: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()

    const orderId = req.params.orderId as unknown as number
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        fruitOrderItems: { createMany: { data: req.body as AddFruitOrderItem[] } }
      }
    })
    res.status(201).json(order)
  } catch (error) {
    responseError(res, error)
  }
}

const deleteOrderItems: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()

    const orderItemId = req.params.fruitOrderItemId as unknown as number
    const orderItem = await prisma.fruitOrderItem.delete({
      where: { id: orderItemId }
    })
    res.status(200).json(orderItem)
  } catch (error) {
    responseError(res, error)
  }
}

export default { addOrderItems, deleteOrderItems }
