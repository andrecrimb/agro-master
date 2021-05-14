import express from 'express'
import { body, param } from 'express-validator'
import userController from '../controllers/user'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import prisma from '../client'

const router = express.Router()

router.get('/users', isAuthSuperUser, userController.getUsers)

router.post(
  '/user',
  isAuthSuperUser,
  [
    body('email')
      .isEmail()
      .custom(value => {
        return prisma.user.findFirst({ where: { email: value } }).then(userFound => {
          if (userFound) return Promise.reject('email_duplicated')
        })
      })
      .bail()
      .normalizeEmail(),
    body('firstName').trim().notEmpty().withMessage('field_empty'),
    body('password').trim().isLength({ min: 5 }).withMessage('short_password')
  ],
  userController.addNewUser
)

router.patch(
  '/user/:userId',
  isAuthSuperUser,
  [
    param('userId').exists().toInt(),
    body('password')
      .if(body('password').exists())
      .trim()
      .isLength({ min: 5 })
      .withMessage('short_password')
  ],
  userController.editUser
)

export default router
