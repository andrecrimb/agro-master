import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthTokenPayload } from '../types/auth'
import prisma from '../client'
import { User } from '.prisma/client'
import { getErrorResponse } from '../utils'

const login: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const {
      body: { email, password }
    } = req

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: 'email_not_found' })
    }

    const samePass = await bcrypt.compare(password, user.password)
    if (!samePass) {
      return res.status(401).json({ error: 'wrong_password' })
    }

    const tokenPayload: AuthTokenPayload = { email, id: user.id }
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET + '', { expiresIn: '7d' })

    res.status(200).json({ token, email, id: user.id })
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const getAuthUser: RequestHandler = async (req, res) => {
  try {
    const currentUser = res.locals.user as User
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperuser: true,
        active: true,
        phoneNumbers: { select: { id: true, label: true, number: true } }
      }
    })
    return res.status(200).json(user)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

export default { login, getAuthUser }
