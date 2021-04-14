import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { AuthTokenPayload } from '../types/auth'

const isAuthenticated: RequestHandler = async (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1]
  try {
    const decodedToken = (await jwt.verify(
      token + '',
      process.env.JWT_SECRET + ''
    )) as AuthTokenPayload

    const user = await User.findOne({ where: { id: decodedToken.id, role: 'superuser' } })

    if (!user) {
      return res.status(401).json({ error: 'not_authenticated' })
    }
    next()
  } catch (e) {
    if (e.name && e.message) {
      return res.status(401).json({ error: 'not_authenticated' })
    }
    return res.status(500).json({})
  }
}

export default isAuthenticated
