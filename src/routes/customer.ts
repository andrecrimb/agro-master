import express from 'express'
import customerController from '../controllers/customer'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import { body, param } from 'express-validator'

const router = express.Router()

router.get('/customers', isAuthSuperUser, customerController.getCustomers)

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

export default router
