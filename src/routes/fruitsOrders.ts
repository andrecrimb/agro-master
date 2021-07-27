import express from 'express'
import { body, param } from 'express-validator'
import prisma from '../client'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import fruitsOrders from '../controllers/fruitsOrders'
import { OrderType, PaymentMethod } from '@prisma/client'

const router = express.Router()

router.get('/orders/fruits', isAuthSuperUser, fruitsOrders.getFruitsOrders)

router.get(
  '/orders/fruits/:orderId',
  isAuthSuperUser,
  param('orderId').exists().toInt(),
  fruitsOrders.getFruitsOrder
)

router.post(
  '/orders/fruits',
  isAuthSuperUser,
  [
    body('type')
      .notEmpty()
      .custom(value => Object.values(OrderType).includes(value))
      .withMessage('invalid_order_type'),
    body('orderDate').trim().notEmpty().toDate(),
    body('deliveryDate').trim().notEmpty().toDate(),
    body('nfNumber').trim().notEmpty(),
    body('installmentsNumber').exists().toInt(),
    body('customerPropertyId')
      .exists()
      .toInt()
      .custom(id => {
        return prisma.customerProperty.findFirst({ where: { propertyId: id } }).then(property => {
          if (!property) return Promise.reject('property_not_found')
        })
      }),
    body('payments.*.amount').exists().toFloat(),
    body('payments.*.method')
      .notEmpty()
      .custom(value => Object.values(PaymentMethod).includes(value))
      .withMessage('invalid_payment_method'),
    body('payments.*.scheduledDate').trim().notEmpty().toDate(),
    body('payments.*.received').isBoolean(),
    body('fruitOrderItems.*.name').trim().notEmpty(),
    body('fruitOrderItems.*.quantity').exists().toInt(),
    body('fruitOrderItems.*.boxPrice').exists().toFloat()
  ],
  fruitsOrders.addFruitsOrder
)

export default router
