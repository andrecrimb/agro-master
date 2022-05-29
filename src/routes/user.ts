import express from 'express'
import { body, param } from 'express-validator'
import userController from '../controllers/user'
import isAuthenticated from '../middleware/isAuthenticated'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import { isNewUserEmail, isUserEmailOrNewEmail } from './validators'

const router = express.Router()

router.get('/users', isAuthSuperUser, userController.getUsers)

router.get(
  '/users/:userId',
  isAuthenticated,
  [param('userId').exists().toInt()],
  userController.getUser
)

router.post(
  '/users',
  isAuthSuperUser,
  [
    body('email').isEmail().custom(isNewUserEmail).bail().normalizeEmail(),
    body('name').trim().notEmpty().withMessage('field_empty'),
    body('password').trim().isLength({ min: 5 }).withMessage('short_password')
  ],
  userController.addNewUser
)

router.patch(
  '/users/:userId',
  isAuthSuperUser,
  [
    param('userId').exists().toInt(),
    body('name').if(body('name').exists()).trim().notEmpty().withMessage('field_empty'),
    body('password')
      .if(body('password').exists())
      .trim()
      .isLength({ min: 5 })
      .withMessage('short_password'),
    body('email')
      .if(body('email').exists())
      .isEmail()
      .custom(isUserEmailOrNewEmail)
      .bail()
      .normalizeEmail()
  ],
  userController.editUser
)

export default router
