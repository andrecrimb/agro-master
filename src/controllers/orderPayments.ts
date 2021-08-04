import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddOrderPayment } from '../types/order'

const addOrderPayment: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const orderId = req.params.orderId as unknown as number

  try {
    const payment = await prisma.order.update({
      where: { id: orderId },
      data: {
        payments: { create: req.body as AddOrderPayment }
      }
    })
    res.status(201).json(payment)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
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
    console.log(e)
    res.status(e.statusCode || 500).json(e)
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
    res.status(201).json(payment)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addOrderPayment, editOrderPayment, deleteOrderPayment }
