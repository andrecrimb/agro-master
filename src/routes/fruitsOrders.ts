import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import fruitsOrders from '../controllers/fruitsOrders'
import { body, param } from 'express-validator'

const router = express.Router()

router.post(
  '/orders/:orderId/fruitOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.name').trim().notEmpty(),
    body('*.quantity').exists().toInt().isInt({ min: 1 }),
    body('*.boxPrice').exists().toFloat().isFloat({ min: 1 })
  ],
  fruitsOrders.addOrderItems
)

router.delete(
  '/orders/:orderId/fruitOrderItems/:fruitOrderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('fruitOrderItemId').exists().toInt()],
  fruitsOrders.deleteOrderItems
)

export default router
