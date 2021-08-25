import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import seedlingsOrders from '../controllers/seedlingsOrders'
import { body, param } from 'express-validator'
import prisma from '../client'
import { Request } from 'express-validator/src/base'
import { AddSeedlingOrderItem } from '../types/order'

const router = express.Router()

router.post(
  '/orders/:orderId/seedlingsOrderItems',
  isAuthSuperUser,
  [
    param('orderId').exists().toInt(),
    body('*.seedlingBenchId').exists().notEmpty().toInt(),
    body('*.unityPrice').exists().toFloat().isFloat({ min: 1 }),
    body('*.quantity').exists().toInt().isInt({ min: 1 }),
    /**
     * Add verification to check if there are seedlings available
     */
    async (req: Request, res: any, next: any) => {
      const orderItems = req.body as AddSeedlingOrderItem[]

      const mappedSum = new Map()

      for (let i = 0; i < orderItems.length; i++) {
        const currVal = orderItems[i]
        if (mappedSum.has(currVal.seedlingBenchId)) {
          mappedSum.set(currVal.seedlingBenchId, {
            index: [...mappedSum.get(currVal.seedlingBenchId).index, i],
            sum: currVal.quantity + mappedSum.get(currVal.seedlingBenchId).sum
          })
        } else {
          mappedSum.set(currVal.seedlingBenchId, { index: [i], sum: currVal.quantity })
        }
      }

      for (const [seedlingBenchId, orderSumItem] of mappedSum) {
        const benchGoal = await prisma.seedlingBench.findFirst({ where: { id: +seedlingBenchId } })
        if (!benchGoal) return Promise.reject('bench_not_found')

        if (orderSumItem.sum > benchGoal.quantity) {
          for (const itemIndex of orderSumItem.index) {
            await body(`[${itemIndex}].quantity`)
              .isInt({ max: -10 })
              .withMessage('quantity_requested_above_current_store')
              .run(req)
          }
        }
      }

      next()
    }
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
