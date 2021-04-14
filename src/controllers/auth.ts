import User from '../models/user'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthTokenPayload } from '../types/auth'
import Phonebook from '../models/phonebook'

const addNewUser: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const {
      body: { password, ...requestValues }
    } = req

    const hashedPw = await bcrypt.hash(password, 12)

    const newUser = await User.create({ ...requestValues, password: hashedPw })
    res.status(201).json(newUser)
  } catch (e) {
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

    const user = await User.findOne({ where: { email } })

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
    const users = await User.findAndCountAll({
      limit: Number(req.query.limit) || undefined,
      offset: Number(req.query.offset) || undefined,
      include: Phonebook
    })

    return res.status(200).json(users)
  } catch (e) {
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addNewUser, login, getUsers }
