import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../client'
import { AuthTokenPayload } from '../types/auth'

const isSuperUser: RequestHandler = async (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1]
  try {
    const decodedToken = (await jwt.verify(
      token + '',
      process.env.JWT_SECRET + ''
    )) as AuthTokenPayload

    const user = await prisma.user.findFirst({ where: { id: decodedToken.id, isSuperuser: true } })

    if (!user) {
      return res.status(403).json({})
    }

    res.locals.user = user
    next()
  } catch (e) {
    if (e.name && e.message) {
      return res.status(401).json({ error: 'not_authenticated' })
    }
    return res.status(500).json({})
  }
}

export default isSuperUser
