import { RequestHandler } from 'express'
import prisma from '../client'
import { validationResult } from 'express-validator'
import { AddCustomerBody, EditCustomerBody } from '../types/customer'

const addCustomer: RequestHandler = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { phoneNumbers = [], ...requestValues } = req.body as AddCustomerBody
    const newCustomer = await prisma.customer.create({
      data: {
        ...requestValues,
        phoneNumbers: { create: phoneNumbers }
      }
    })

    res.status(201).json(newCustomer)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const editCustomer: RequestHandler = async (req, res) => {
  const params = req.params as unknown as { customerId: number }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { phoneNumbers, ...requestValues } = req.body as EditCustomerBody
    let toUpdate = { ...requestValues }

    if (phoneNumbers) {
      await prisma.customer.update({
        where: { id: params.customerId },
        data: { phoneNumbers: { deleteMany: {}, create: phoneNumbers } }
      })
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: params.customerId },
      data: toUpdate
    })

    res.status(200).json(updatedCustomer)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

const getCustomers: RequestHandler = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        nickname: true,
        active: true,
        address: true,
        zip: true,
        city: true,
        state: true,
        phoneNumbers: { select: { id: true, label: true, number: true } }
      }
    })
    return res.status(200).json(customers)
  } catch (e) {
    res.status(e.status || 500).json(e)
  }
}

const deleteCustomer: RequestHandler = async (req, res) => {
  const params = req.params as unknown as { customerId: number }
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const customer = await prisma.customer.delete({ where: { id: params.customerId } })
    res.status(201).json(customer)
  } catch (e) {
    console.log(e)
    res.status(e.statusCode || 500).json(e)
  }
}

export default { addCustomer, editCustomer, getCustomers, deleteCustomer }
