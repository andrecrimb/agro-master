import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import seedsOrders from '../controllers/seedsOrders'
import { body, param } from 'express-validator'

const router = express.Router()

router.post(
  '/orders/:orderId/seedsOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.name').trim().notEmpty(),
    body('*.quantity').exists().toInt().isInt({ min: 1 }),
    body('*.kgPrice').exists().toFloat().isFloat({ min: 1 })
  ],
  seedsOrders.addOrderItems
)

router.delete(
  '/orders/:orderId/seedsOrderItems/:orderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('orderItemId').exists().toInt()],
  seedsOrders.deleteOrderItems
)

export default router
