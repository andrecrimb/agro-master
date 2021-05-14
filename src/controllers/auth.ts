import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AddUserBody, AuthTokenPayload } from '../types/auth'
import prisma from '../client'
import { User } from '.prisma/client'

const addNewUser: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const reqBody = req.body as AddUserBody
    const { password, phoneNumbers = [], ...requestValues } = reqBody

    const hashedPw = await bcrypt.hash(password, 12)
    const newUser = await prisma.user.create({
      data: { ...requestValues, password: hashedPw, phoneNumbers: { create: phoneNumbers } }
    })

    res.status(201).json(newUser)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

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
    res.status(e.statusCode || 500).json(e)
  }
}

const getUsers: RequestHandler = async (req, res) => {
  try {
    const currentUser = res.locals.user as User
    const users = await prisma.user.findMany({
      where: { id: { not: currentUser.id }, isEmployee: false },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        email: true,
        isSuperuser: true,
        isEmployee: true,
        active: true
      }
    })
    return res.status(200).json(users)
  } catch (e) {
    res.status(e.statusCode || 500).json(e)
  }
}

const getUser: RequestHandler = async (req, res) => {
  try {
    const currentUser = res.locals.user as User
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        email: true,
        isSuperuser: true,
        isEmployee: true,
        active: true
      }
    })
    return res.status(200).json(user)
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }
}

export default { addNewUser, login, getUser, getUsers }
