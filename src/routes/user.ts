import express from 'express'
import { body, param } from 'express-validator'
import userController from '../controllers/user'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import prisma from '../client'
import property from '../controllers/property'

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
    body('firstName').if(body('firstName').exists()).trim().notEmpty().withMessage('field_empty'),
    body('password')
      .if(body('password').exists())
      .trim()
      .isLength({ min: 5 })
      .withMessage('short_password'),
    body('email')
      .if(body('email').exists())
      .isEmail()
      .custom((value, { req }) => {
        return prisma.user.findFirst({ where: { email: value } }).then(user => {
          if (user && user.id !== +req.params?.userId) {
            return Promise.reject('email_duplicated')
          }
        })
      })
      .bail()
      .normalizeEmail()
  ],
  userController.editUser
)

export default router
