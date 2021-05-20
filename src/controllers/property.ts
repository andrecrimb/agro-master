import { RequestHandler } from 'express'
import prisma from '../client'
import { validationResult } from 'express-validator'
import { AddOwnerPropertyBody } from '../types/property'

const addNewOwnerProperty: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const newProperty = await prisma.ownerProperty.create({
      data: {
        property: { create: req.body as AddOwnerPropertyBody }
      }
    })

    res.status(201).json(newProperty)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const getOwnerProperties: RequestHandler = async (req, res) => {
  try {
    const properties = await prisma.ownerProperty.findMany({
      select: {
        id: true,
        property: {
          select: {
            id: true,
            producerName: true,
            name: true,
            cnpj: true,
            cpf: true,
            ie: true,
            address: true,
            zip: true,
            city: true,
            state: true,
            country: true
          }
        }
      }
    })
    return res.status(200).json(properties)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

export default { getOwnerProperties, addNewOwnerProperty }
