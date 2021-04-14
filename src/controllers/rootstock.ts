import Rootstock from '../models/rootstock'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'

const addNewRootstock: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  try {
    const newRootstock = await Rootstock.create(req.body)
    res.status(201).json(newRootstock)
  } catch (e) {
    res.status(400).json(e)
  }
}

const getRootstocks: RequestHandler = async (req, res) => {
  Rootstock.findAll().then(items => {
    console.log(items)
    res.status(200).json(items)
  })
}

export default { addNewRootstock, getRootstocks }
