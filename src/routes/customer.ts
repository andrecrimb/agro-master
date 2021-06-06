import express from 'express'
import customerController from '../controllers/customer'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import { body, param } from 'express-validator'
import prisma from '../client'

const router = express.Router()

router.get('/customers', isAuthSuperUser, customerController.getCustomers)

router.get(
  '/customers/:customerId',
  isAuthSuperUser,
  param('customerId').exists().toInt(),
  customerController.getCustomer
)

router.delete(
  '/customers/:customerId',
  isAuthSuperUser,
  param('customerId').exists().toInt(),
  customerController.deleteCustomer
)

router.patch(
  '/customers/:customerId',
  isAuthSuperUser,
  [
    param('customerId').exists().toInt(),
    body('firstName').if(body('firstName').exists()).trim().notEmpty(),
    body('lastName').if(body('lastName').exists()).trim().notEmpty()
  ],
  customerController.editCustomer
)

router.post(
  '/customers',
  isAuthSuperUser,
  [body('firstName').trim().notEmpty(), body('lastName').trim().notEmpty()],
  customerController.addCustomer
)

router.post(
  '/customers/:customerId/properties',
  isAuthSuperUser,
  [
    param('customerId').exists().toInt(),
    body('cnpj')
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom(value => {
        return prisma.customerProperty
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
  customerController.addCustomerProperty
)

export default router
