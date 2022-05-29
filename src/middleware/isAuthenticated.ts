import { RequestHandler } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../client'
import { AuthTokenPayload } from '../types/auth'

const isAuthenticated: RequestHandler = async (req, res, next) => {
  try {
    const token = req.get('Authorization')?.split(' ')[1]
    const decodedToken = (await jwt.verify(
      token + '',
      process.env.JWT_SECRET + ''
    )) as AuthTokenPayload

    const user = await prisma.user.findFirst({ where: { id: decodedToken.id } })

    if (!user) {
      return res.status(401).json({ error: 'not_authenticated' })
    }

    res.locals.user = user
    next()
  } catch (e) {
    //@ts-ignore
    if (e.name && e.message) {
      return res.status(401).json({ error: 'not_authenticated' })
    }
    return res.status(500).json({})
  }
}

export default isAuthenticated
