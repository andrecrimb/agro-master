import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import seedlingsOrders from '../controllers/seedlingsOrders'
import { body, param } from 'express-validator'
import {
  orderNotCanceled,
  seedlingBenchExists,
  seedlingQtdSumDoesNotTrespassAvailableStore
} from './validators'

const router = express.Router()

router.post(
  '/orders/:orderId/seedlingsOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt().custom(orderNotCanceled).bail(),
    body('*.seedlingBenchId').exists().notEmpty().toInt().custom(seedlingBenchExists).bail(),
    body('*.unityPrice').exists().toFloat().isFloat({ min: 1 }),
    body('*.quantity').exists().toInt().isInt({ min: 1 }),
    seedlingQtdSumDoesNotTrespassAvailableStore
  ],
  seedlingsOrders.addOrderItems
)

router.delete(
  '/orders/:orderId/seedlingsOrderItems/:orderItemId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt().custom(orderNotCanceled).bail(),
    param('orderItemId').exists().toInt()
  ],
  seedlingsOrders.deleteOrderItems
)

export default router
