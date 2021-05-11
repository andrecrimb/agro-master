import express from 'express'
import { body } from 'express-validator'
import authController from '../controllers/auth'
import isAuthSuperUser from '../middleware/isAuthSuperUser'
import isAuthenticated from '../middleware/isAuthenticated'
import prisma from '../client'

const router = express.Router()

router.get('/authuser', isAuthenticated, authController.getUser)
router.get('/users', isAuthSuperUser, authController.getUsers)

router.post(
  '/user',
  isAuthSuperUser,
  [
    body('email')
      .isEmail()
      .custom(value => {
        return prisma.user.findFirst({ where: { email: value } }).then(userFound => {
          if (userFound) return Promise.reject('duplicated')
        })
      })
      .bail()
      .normalizeEmail(),
    body('firstName').trim().notEmpty(),
    body('password').trim().isLength({ min: 5 })
  ],
  authController.addNewUser
)

router.post(
  '/login',
  [body('email').trim().isEmail(), body('password').exists()],
  authController.login
)

export default router
