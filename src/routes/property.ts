import express from 'express'
import propertyController from '../controllers/property'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'
import { body, param } from 'express-validator'
import prisma from '../client'

const router = express.Router()

router.get('/owner-properties', isAuthSuperUser, propertyController.getOwnerProperties)

router.get(
  '/owner-properties/:ownerPropertyId',
  isAuthenticated,
  param('ownerPropertyId').exists().toInt(),
  propertyController.getOwnerProperty
)

router.delete(
  '/owner-properties/:ownerPropertyId',
  isAuthSuperUser,
  param('ownerPropertyId').exists().toInt(),
  propertyController.deleteOwnerProperty
)

router.post(
  '/owner-properties',
  isAuthSuperUser,
  [
    body('cnpj')
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom(value => {
        return prisma.ownerProperty
          .findFirst({ where: { property: { cnpj: value } } })
          .then(property => {
            if (property) return Promise.reject('cnpj_duplicated')
          })
      })
      .bail(),
    body('name').trim().notEmpty(),
    body('producerName').trim().notEmpty(),
    body('ie').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('zip').trim().notEmpty(),
    body('city').trim().notEmpty(),
    body('state').trim().notEmpty()
  ],
  propertyController.addNewOwnerProperty
)

router.patch(
  '/owner-properties/:ownerPropertyId',
  isAuthSuperUser,
  [
    param('ownerPropertyId').exists().toInt(),
    body('cnpj')
      .if(body('cnpj').exists())
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom((value, { req }) => {
        return prisma.ownerProperty
          .findFirst({ where: { property: { cnpj: value } } })
          .then(property => {
            if (property && property.id !== +req.params?.ownerPropertyId) {
              return Promise.reject('cnpj_duplicated')
            }
          })
      })
      .bail(),
    body('name').if(body('name').exists()).trim().notEmpty(),
    body('producerName').if(body('producerName').exists()).trim().notEmpty(),
    body('ie').if(body('ie').exists()).trim().notEmpty(),
    body('address').if(body('address').exists()).trim().notEmpty(),
    body('zip').if(body('zip').exists()).trim().notEmpty(),
    body('city').if(body('city').exists()).trim().notEmpty(),
    body('state').if(body('state').exists()).trim().notEmpty()
  ],
  propertyController.editOwnerProperty
)

export default router
