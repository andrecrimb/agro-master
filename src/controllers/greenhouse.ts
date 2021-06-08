import { Request, RequestHandler } from 'express'
import prisma from '../client'
import { validationResult } from 'express-validator'
import { AddGreenhouseBody, EditGreenhouseBody } from '../types/greenhouse'

const getGreenhouses: RequestHandler = async (req, res) => {
  try {
    const greenhouses = await prisma.greenhouse.findMany({
      select: {
        id: true,
        label: true,
        type: true,
        ownerProperty: { select: { property: { select: { name: true } } } }
      }
    })
    return res.status(200).json(greenhouses)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

const getGreenhouse: RequestHandler = async (req, res) => {
  try {
    const greenhouseId = req.params.greenhouseId as unknown as number
    const greenhouse = await prisma.greenhouse.findUnique({
      where: { id: greenhouseId },
      select: {
        id: true,
        label: true,
        type: true,
        ownerProperty: { select: { property: { select: { name: true } } } },
        seedlingBenches: {
          select: {
            id: true,
            updatedAt: true,
            name: true,
            quantity: true,
            lastPlantingDate: true,
            firstPaymentDate: true,
            rootstock: { select: { name: true, id: true } }
          }
        }
      }
    })
    return res.status(200).json(greenhouse)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

const addGreenhouse: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const greenhouse = await prisma.greenhouse.create({
      data: req.body as AddGreenhouseBody
    })

    res.status(201).json(greenhouse)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const editGreenhouse: RequestHandler = async (req, res) => {
  const params = req.params as unknown as { greenhouseId: number }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const requestValues = req.body as EditGreenhouseBody

    const greenhouse = await prisma.greenhouse.update({
      where: { id: params.greenhouseId },
      data: requestValues
    })

    res.status(201).json(greenhouse)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { getGreenhouses, getGreenhouse, addGreenhouse, editGreenhouse }
