import express from 'express'
import { body } from 'express-validator'
import rootstockController from '../controllers/rootstock'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'

const router = express.Router()

router.post(
  '/rootstocks',
  isAuthSuperUser,
  [body('name').trim().notEmpty()],
  rootstockController.addNewRootstock
)
router.get('/rootstocks', isAuthenticated, rootstockController.getRootstocks)

export default router
