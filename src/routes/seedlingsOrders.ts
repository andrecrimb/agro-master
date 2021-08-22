import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import seedlingsOrders from '../controllers/seedlingsOrders'
import { body, param } from 'express-validator'
import prisma from '../client'

const router = express.Router()

router.post(
  '/orders/:orderId/seedlingsOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.seedlingBenchId').exists().notEmpty().toInt(),
    body('*.quantity')
      .exists()
      .toInt()
      .isInt({ min: 1 })
      .custom((val, { req }) => {
        return prisma.seedlingBench
          .findFirst({ where: { id: req.body.seedlingBenchId } })
          .then(bench => {
            if (!bench) return Promise.reject('bench_not_found')
            if (val > bench.quantity) {
              return Promise.reject('quantity_requested_above_current_store')
            }
          })
      }),
    body('*.unityPrice').exists().toFloat().isFloat({ min: 1 })
  ],
  seedlingsOrders.addOrderItems
)

router.delete(
  '/orders/:orderId/seedlingsOrderItems/:orderItemId',
  isAuthSuperUser,
  [param('orderId').exists().toInt(), param('orderItemId').exists().toInt()],
  seedlingsOrders.deleteOrderItems
)

export default router
