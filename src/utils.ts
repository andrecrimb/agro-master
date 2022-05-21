import { Prisma } from '@prisma/client'

export function getErrorResponse(e: unknown) {
  return e instanceof Prisma.PrismaClientKnownRequestError
    ? e.meta
    : { cause: 'Something wrong happened' }
}
