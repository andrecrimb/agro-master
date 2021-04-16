import prisma from '../config/prismaInstance'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

const addNewRootstock: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  try {
    const newRootstock = await prisma.rootstock.create(req.body)
    res.status(201).json(newRootstock)
  } catch (e) {
    res.status(400).json(e)
  }
}

export default { addNewRootstock }
