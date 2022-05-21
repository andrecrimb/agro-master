import prisma from '../client'
import { RequestHandler } from 'express'
import { validationResult } from 'express-validator'
import { AddRootstockBody, EditRootstockBody } from '../types/rootstock'
import { getErrorResponse } from '../utils'

const addNewRootstock: RequestHandler = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  try {
    const requestValues = req.body as AddRootstockBody
    const newRootstock = await prisma.rootstock.create({ data: requestValues })
    res.status(201).json(newRootstock)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const getRootstocks: RequestHandler = async (req, res) => {
  try {
    const rootstocks = await prisma.rootstock.findMany({
      select: {
        id: true,
        name: true
      }
    })
    return res.status(200).json(rootstocks)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const deleteRootstock: RequestHandler = async (req, res) => {
  const params = req.params as unknown as { rootstockId: number }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const rootstock = await prisma.rootstock.delete({ where: { id: params.rootstockId } })
    res.status(201).json(rootstock)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

const editRootstock: RequestHandler = async (req, res) => {
  const params = req.params as unknown as { rootstockId: number }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const toUpdate = req.body as EditRootstockBody

    const updatedRootstock = await prisma.rootstock.update({
      where: { id: params.rootstockId },
      data: toUpdate
    })

    res.status(200).json(updatedRootstock)
  } catch (e) {
    res.status(500).json(getErrorResponse(e))
  }
}

export default { addNewRootstock, getRootstocks, editRootstock, deleteRootstock }
