import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import prisma from '../client'
import { AddOrderPayment } from '../types/order'
import { responseError } from '../utils'

const addOrderPayments: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()

    const orderId = req.params.orderId as unknown as number
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        payments: { createMany: { data: req.body as AddOrderPayment[] } }
      }
    })
    res.status(201).json(order)
  } catch (error) {
    responseError(res, error)
  }
}

const editOrderPayment: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()

    const orderId = req.params.orderId as unknown as number
    const paymentId = req.params.paymentId as unknown as number
    const payment = await prisma.orderPayment.update({
      where: { id: paymentId },
      data: { orderId, ...(req.body as AddOrderPayment) }
    })
    res.status(201).json(payment)
  } catch (error) {
    responseError(res, error)
  }
}

const deleteOrderPayment: RequestHandler = async (req, res) => {
  try {
    validationResult(req).throw()

    const paymentId = req.params.paymentId as unknown as number
    const payment = await prisma.orderPayment.delete({
      where: { id: paymentId }
    })
    res.status(200).json(payment)
  } catch (error) {
    responseError(res, error)
  }
}

export default { addOrderPayments, editOrderPayment, deleteOrderPayment }
