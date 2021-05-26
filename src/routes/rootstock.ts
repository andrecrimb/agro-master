import express from 'express'
import { body, param } from 'express-validator'
import prisma from '../client'
import rootstockController from '../controllers/rootstock'
import isAuthSuperUser from '../middleware/isAuthSuperUser'

const router = express.Router()

router.get('/rootstocks', isAuthSuperUser, rootstockController.getRootstocks)

router.post(
  '/rootstocks',
  isAuthSuperUser,
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom(value => {
        return prisma.rootstock.findUnique({ where: { name: value } }).then(rootstock => {
          if (rootstock) return Promise.reject('rootstock_duplicated')
        })
      })
  ],
  rootstockController.addNewRootstock
)

router.patch(
  '/rootstocks/:rootstockId',
  isAuthSuperUser,
  [
    param('rootstockId').exists().toInt(),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom((value, { req }) => {
        return prisma.rootstock.findUnique({ where: { name: value } }).then(rootstock => {
          if (rootstock && rootstock.id !== +req.params?.rootstockId) {
            return Promise.reject('rootstock_duplicated')
          }
        })
      })
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
