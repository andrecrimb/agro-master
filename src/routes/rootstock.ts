import express from 'express'
import { body, param } from 'express-validator'
import rootstockController from '../controllers/rootstock'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import { isNewRootstockNameUnique, isRootstockNameUnique } from './validators'

const router = express.Router()

router.get('/rootstocks', isAuthSuperUser, rootstockController.getRootstocks)

router.post(
  '/rootstocks',
  isAuthSuperUser,
  [body('name').trim().notEmpty().withMessage('field_empty').custom(isNewRootstockNameUnique)],
  rootstockController.addNewRootstock
)

router.patch(
  '/rootstocks/:rootstockId',
  isAuthSuperUser,
  [
    param('rootstockId').exists().toInt(),
    body('name').trim().notEmpty().withMessage('field_empty').custom(isRootstockNameUnique)
  ],
  rootstockController.editRootstock
)

router.delete(
  '/rootstocks/:rootstockId',
  isAuthSuperUser,
  [param('rootstockId').exists().toInt()],
  rootstockController.deleteRootstock
)

export default router
