import User from '../models/user'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import bcrypt from 'bcryptjs'
type User = {
  email: string
  password: string
}
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
      return res.status(401).json({})
    }

    // const samePass = await bcrypt.compare(password, user.password)
  } catch (e) {
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addNewUser, login }
