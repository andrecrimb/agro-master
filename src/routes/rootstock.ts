import express from 'express'
import { body } from 'express-validator'
import rootstockController from '../controllers/rootstock'
import isAuthSuperUser from '../middleware/isAuthSuperUser'

const router = express.Router()

router.post(
  '/rootstocks',
  isAuthSuperUser,
  [body('name').trim().notEmpty()],
  rootstockController.addNewRootstock
)

export default router
