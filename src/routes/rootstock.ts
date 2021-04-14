import express from 'express'
import { body } from 'express-validator'
import rootstockController from '../controllers/rootstock'

const router = express.Router()

router.post('/rootstocks', [body('name').trim().notEmpty()], rootstockController.addNewRootstock)
router.get('/rootstocks', rootstockController.getRootstocks)

export default router
