import express from 'express'
import customerController from '../controllers/customer'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import { body, param } from 'express-validator'
import prisma from '../client'
import { isCustomerCnpjOrNewCnpj, isNewCustomerCnpj } from './validators'

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
  [param('customerId').exists().toInt(), body('name').if(body('name').exists()).trim().notEmpty()],
  customerController.editCustomer
)

router.post(
  '/customers',
  isAuthSuperUser,
  [body('name').trim().notEmpty()],
  customerController.addCustomer
)

router.post(
  '/customers/:customerId/properties',
  isAuthSuperUser,
  [
    param('customerId').exists().toInt(),
    body('cnpj').trim().notEmpty().withMessage('field_empty').custom(isNewCustomerCnpj).bail(),
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

router.patch(
  '/customers/:customerId/properties/:propertyId',
  isAuthSuperUser,
  [
    param('customerId').exists().toInt(),
    param('propertyId').exists().toInt(),
    body('cnpj')
      .if(body('cnpj').exists())
      .trim()
      .notEmpty()
      .withMessage('field_empty')
      .custom(isCustomerCnpjOrNewCnpj)
      .bail(),
    body('name').if(body('name').exists()).trim().notEmpty(),
    body('producerName').if(body('producerName').exists()).trim().notEmpty(),
    body('ie').if(body('ie').exists()).trim().notEmpty(),
    body('address').if(body('address').exists()).trim().notEmpty(),
    body('zip').if(body('zip').exists()).trim().notEmpty(),
    body('city').if(body('city').exists()).trim().notEmpty(),
    body('state').if(body('state').exists()).trim().notEmpty()
  ],
  customerController.editCustomerProperty
)

router.delete(
  '/customers/:customerId/properties/:propertyId',
  isAuthSuperUser,
  [param('customerId').exists().toInt(), param('propertyId').exists().toInt()],
  customerController.deleteCustomerProperty
)

export default router
