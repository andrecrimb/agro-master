import { body, param, query } from 'express-validator'
import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'
import greenhouseController from '../controllers/greenhouse'
import {
  greenhouseExists,
  ownerPropertyExists,
  rootstockExists,
  seedlingBenchExists,
  uniqueGreenhouseOnProperty,
  uniqueSeedlingBench,
  uniqueSeedlingBenchInGreenhouse,
  userExists
} from './validators'

const router = express.Router()

router.get(
  '/greenhouses',
  isAuthenticated,
  [query('ownerPropertyId').if(query('ownerPropertyId')).exists().trim().toInt()],
  greenhouseController.getGreenhouses
)
router.get(
  '/greenhouses/:greenhouseId',
  isAuthenticated,
  param('greenhouseId').exists().toInt(),
  greenhouseController.getGreenhouse
)

router.post(
  '/greenhouses',
  isAuthSuperUser,
  [
    body('type').trim().notEmpty(),
    body('label').trim().notEmpty().custom(uniqueGreenhouseOnProperty),
    body('ownerPropertyId').trim().notEmpty().toInt().custom(ownerPropertyExists)
  ],
  greenhouseController.addGreenhouse
)

router.patch(
  '/greenhouses/:greenhouseId',
  isAuthSuperUser,
  [
    body('label').trim().notEmpty(),
    body('type').trim().notEmpty(),
    param('greenhouseId').exists().toInt(),
    body('ownerPropertyId').exists().toInt().custom(ownerPropertyExists)
  ],
  greenhouseController.editGreenhouse
)

router.delete(
  '/greenhouses/:greenhouseId',
  isAuthSuperUser,
  param('greenhouseId').exists().toInt(),
  greenhouseController.deleteGreenhouse
)

router.post(
  '/greenhouses/:greenhouseId/benches',
  isAuthSuperUser,
  [
    body('label').trim().notEmpty().custom(uniqueSeedlingBench),
    body('quantity').trim().toFloat().isFloat({ min: 1 }),
    body('lastPlantingDate').trim().notEmpty().toDate(),
    body('firstPaymentDate').trim().notEmpty().toDate(),
    param('greenhouseId').trim().notEmpty().toInt().custom(greenhouseExists),
    body('rootstockId').trim().notEmpty().toInt().custom(rootstockExists),
    body('userId').trim().notEmpty().toInt().custom(userExists)
  ],
  greenhouseController.addBench
)

router.put(
  '/greenhouses/:greenhouseId/benches/:benchId',
  isAuthSuperUser,
  [
    body('label').trim().notEmpty().custom(uniqueSeedlingBenchInGreenhouse),
    body('quantity').toInt().isInt({ min: 1 }),
    body('lastPlantingDate').trim().notEmpty().toDate(),
    body('firstPaymentDate').trim().notEmpty().toDate(),
    param('benchId').trim().notEmpty().toInt().custom(seedlingBenchExists),
    param('greenhouseId').trim().notEmpty().toInt().custom(greenhouseExists),
    body('rootstockId').trim().notEmpty().toInt().custom(rootstockExists),
    body('userId').trim().notEmpty().toInt().custom(userExists)
  ],
  greenhouseController.editBench
)

router.delete(
  '/greenhouses/:greenhouseId/benches/:benchId',
  isAuthSuperUser,
  [param('greenhouseId').exists().toInt(), param('benchId').exists().toInt()],
  greenhouseController.deleteBench
)

export default router
