import express from 'express'
import { body } from 'express-validator'
import authController from '../controllers/auth'
import isAuthenticated from '../middleware/isAuthenticated'

const router = express.Router()

router.get('/authuser', isAuthenticated, authController.getAuthUser)
router.post(
  '/login',
  [body('email').trim().isEmail(), body('password').exists()],
  authController.login
)

export default router
