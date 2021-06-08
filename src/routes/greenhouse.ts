import { body, param } from 'express-validator'
import prisma from '../client'
import express from 'express'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'
import greenhouseController from '../controllers/greenhouse'

const router = express.Router()

router.get('/greenhouses', isAuthenticated, greenhouseController.getGreenhouses)
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
    body('label').trim().notEmpty(),
    body('type').trim().notEmpty(),
    body('ownerPropertyId')
      .trim()
      .notEmpty()
      .toInt()
      .custom(value => {
        return prisma.ownerProperty.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_property')
        })
      })
  ],
  greenhouseController.addGreenhouse
)

router.patch(
  '/greenhouses/:greenhouseId',
  isAuthSuperUser,
  [
    body('label').trim().notEmpty(),
    body('type').trim().notEmpty(),
    body('ownerPropertyId')
      .exists()
      .toInt()
      .custom(value => {
        return prisma.ownerProperty.findFirst({ where: { id: value } }).then(property => {
          if (!property) return Promise.reject('no_property')
        })
      })
  ],
  greenhouseController.editGreenhouse
)

export default router
