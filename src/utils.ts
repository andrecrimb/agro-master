import { Prisma } from '@prisma/client'
import { Response } from 'express'
import { Result, ValidationError } from 'express-validator'

export const isValidationError = (
  error: unknown
): error is Result<ValidationError> | undefined | null => {
  try {
    return !!error && Object.prototype.hasOwnProperty.call(error, 'array')
  } catch {
    return false
  }
}

export const isPrismaRequestError = (
  error: unknown
): error is Prisma.PrismaClientKnownRequestError | undefined | null => {
  try {
    return !!error && error instanceof Prisma.PrismaClientKnownRequestError
  } catch {
    return false
  }
}

//TODO change this verification properly
export function getErrorResponse(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError
    ? { cause: e }
    : { cause: 'Something wrong happened' }
}

export const responseError = (response: Response<any, Record<string, any>>, error: unknown) => {
  if (isValidationError(error)) return response.status(400).json(error?.array())
  if (isPrismaRequestError(error)) return response.status(500).json(getErrorResponse(error))

  return response.status(500).json({ cause: 'Something bad happened' })
}
