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
    body('*.amount').exists().toFloat().isFloat({ min: 1 }),
    body('*.method').isIn(Object.values(PaymentMethod)).withMessage('invalid_payment_method'),
    body('*.scheduledDate').trim().notEmpty().toDate(),
    body('*.received').exists().isBoolean()
  ],
  orderPayments.addOrderPayments
)

router.patch(
  '/orders/:orderId/payments/:paymentId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    param('paymentId').exists().toInt(),
    body('amount').exists().toFloat().isFloat({ min: 1 }),
    body('method').isIn(Object.values(PaymentMethod)).withMessage('invalid_payment_method'),
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
