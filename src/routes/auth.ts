import express from 'express'
import { body } from 'express-validator'
import authController from '../controllers/auth'
import User from '../models/user'

const router = express.Router()

router.post(
  '/user',
  [
    body('email')
      .isEmail()
      .custom(value => {
        return User.findOne({ where: { email: value } }).then(userFound => {
          if (userFound) return Promise.reject('duplicated')
        })
      })
      .bail()
      .normalizeEmail(),
    body('lastName').trim().notEmpty(),
    body('firstName').trim().notEmpty(),
    body('password').trim().isLength({ min: 5 }),
    body('role').exists()
  ],
  authController.addNewUser
)

router.post('login')

export default router
