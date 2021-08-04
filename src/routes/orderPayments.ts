import express from 'express'
import { body, param } from 'express-validator'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import orderPayments from '../controllers/orderPayments'
import { PaymentMethod } from '@prisma/client'

const router = express.Router()

router.post(
  '/orders/:orderId/payments',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('amount').exists().toInt(),
    body('method')
      .notEmpty()
      .custom(value => Object.values(PaymentMethod).includes(value))
      .withMessage('invalid_payment_method'),
    body('scheduledDate').trim().notEmpty().toDate(),
    body('received').exists().isBoolean()
  ],
  orderPayments.addOrderPayment
)

router.patch(
  '/orders/:orderId/payments/:paymentId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    param('paymentId').exists().toInt(),
    body('amount').exists().toInt(),
    body('method')
      .notEmpty()
      .custom(value => Object.values(PaymentMethod).includes(value))
      .withMessage('invalid_payment_method'),
    body('scheduledDate').trim().notEmpty().toDate(),
    body('received').exists().isBoolean()
  ],
  orderPayments.editOrderPayment
)

router.delete(
  '/orders/:orderId/payments/:paymentId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('paymentId').exists().toInt()],
  orderPayments.deleteOrderPayment
)

export default router
