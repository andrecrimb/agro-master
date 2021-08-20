import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import rootstocksOrders from '../controllers/rootstocksOrders'
import { body, param } from 'express-validator'

const router = express.Router()

router.post(
  '/orders/:orderId/rootstocksOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.rootstockId').exists().notEmpty().toInt(),
    body('*.quantity').exists().toInt(),
    body('*.unityPrice').exists().toFloat()
  ],
  rootstocksOrders.addOrderItems
)

router.put(
  '/orders/:orderId/rootstocksOrderItems/:orderItemId',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    param('orderItemId').exists().toInt(),
    body('rootstockId').exists().notEmpty().toInt(),
    body('quantity').exists().toInt(),
    body('unityPrice').exists().toFloat()
  ],
  rootstocksOrders.editOrderItems
)

router.delete(
  '/orders/:orderId/rootstocksOrderItems/:orderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('orderItemId').exists().toInt()],
  rootstocksOrders.deleteOrderItems
)

export default router
