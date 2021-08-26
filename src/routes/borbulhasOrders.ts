import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import borbulhasOrders from '../controllers/borbulhasOrders'
import { body, param } from 'express-validator'

const router = express.Router()

router.post(
  '/orders/:orderId/borbulhasOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.name').trim().notEmpty(),
    body('*.quantity').exists().toInt().isInt({ min: 1 }),
    body('*.unityPrice').exists().toFloat().isFloat({ min: 1 })
  ],
  borbulhasOrders.addOrderItems
)

router.delete(
  '/orders/:orderId/borbulhasOrderItems/:orderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('orderItemId').exists().toInt()],
  borbulhasOrders.deleteOrderItems
)

export default router
