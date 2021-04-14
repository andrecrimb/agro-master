import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { AuthTokenPayload } from '../types/auth'

const isAuthenticated: RequestHandler = async (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1]

  try {
    const decodedToken = jwt.verify(token + '', process.env.JWT_SECRET + '') as
      | AuthTokenPayload
      | undefined

    if (!decodedToken) {
      return res.status(401).json({ error: 'not_authenticated' })
    }

    const user = await User.findByPk(decodedToken.id)

    if (!user) {
      return res.status(401).json({ error: 'not_authenticated' })
    }
    next()
  } catch {
    res.status(500)
  }
}

export default isAuthenticated
