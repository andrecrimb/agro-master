import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user'
import { AuthTokenPayload } from '../types/auth'

const isSuperUser: RequestHandler = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1]
    const decodedToken =
      token && (jwt.verify(token, process.env.JWT_SECRET + '') as AuthTokenPayload | undefined)

    if (!decodedToken) {
      return res.status(401).json({ error: 'not_authenticated' })
    }

    const user = await User.findOne({ where: { id: decodedToken.id, role: 'superuser' } })

    if (!user) {
      return res.status(403).json()
    }
    next()
  } catch {
    res.status(500)
  }
}

export default isSuperUser
