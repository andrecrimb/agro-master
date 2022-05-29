import express from 'express'
import { body, param, query } from 'express-validator'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import orders from '../controllers/orders'
import { OrderType } from '@prisma/client'
import { customerPropertyExists, orderNotCanceled } from './validators'

const router = express.Router()

router.get(
  '/orders',
  isAuthSuperUser,
  query('type').if(query('type').exists()).isIn(Object.values(OrderType)),
  orders.getOrders
)

router.get('/orders/:orderId', isAuthSuperUser, param('orderId').exists().toInt(), orders.getOrder)

router.post(
  '/orders',
  isAuthSuperUser,
  [
    body('type').isIn(Object.values(OrderType)).withMessage('invalid_order_type'),
    body('orderDate').trim().notEmpty().toDate(),
    body('deliveryDate').trim().notEmpty().toDate(),
    body('customerPropertyId').exists().toInt().custom(customerPropertyExists)
  ],
  orders.addOrder
)

router.put(
  '/orders/:orderId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt().custom(orderNotCanceled),
    body('type').not().exists(),
    body('orderDate').trim().notEmpty().toDate(),
    body('deliveryDate').trim().notEmpty().toDate(),
    body('customerPropertyId').exists().toInt().custom(customerPropertyExists)
  ],
  orders.editOrder
)

router.put(
  '/orders/:orderId/cancel',
  isAuthSuperUser,
  [param('orderId').exists().toInt().custom(orderNotCanceled)],
  orders.cancelOrder
)

export default router
