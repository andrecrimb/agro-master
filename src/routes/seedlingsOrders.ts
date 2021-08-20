import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import seedlingsOrders from '../controllers/seedlingsOrders'
import { body, param } from 'express-validator'

const router = express.Router()

router.post(
  '/orders/:orderId/seedlingsOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.seedlingBenchId').exists().notEmpty().toInt(),
    body('*.quantity').exists().toInt(),
    body('*.unityPrice').exists().toFloat()
  ],
  seedlingsOrders.addOrderItems
)

router.put(
  '/orders/:orderId/seedlingsOrderItems/:orderItemId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    param('orderItemId').exists().toInt(),
    body('seedlingBenchId').exists().notEmpty().toInt(),
    body('quantity').exists().toInt(),
    body('unityPrice').exists().toFloat()
  ],
  seedlingsOrders.editOrderItems
)

router.delete(
  '/orders/:orderId/seedlingsOrderItems/:orderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('orderItemId').exists().toInt()],
  seedlingsOrders.deleteOrderItems
)

export default router
