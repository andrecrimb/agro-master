import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddOrderPayment } from '../types/order'
import { getErrorResponse } from '../utils'

const addOrderPayments: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        payments: { createMany: { data: req.body as AddOrderPayment[] } }
      }
    })
    res.status(201).json(order)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const editOrderPayment: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number
  const paymentId = req.params.paymentId as unknown as number

  try {
    const payment = await prisma.orderPayment.update({
      where: { id: paymentId },
      data: { orderId, ...(req.body as AddOrderPayment) }
    })
    res.status(201).json(payment)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const deleteOrderPayment: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const paymentId = req.params.paymentId as unknown as number

  try {
    const payment = await prisma.orderPayment.delete({
      where: { id: paymentId }
    })
    res.status(200).json(payment)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

export default { addOrderPayments, editOrderPayment, deleteOrderPayment }
