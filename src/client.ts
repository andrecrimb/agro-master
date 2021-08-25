import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'pretty'
})

prisma.$on('beforeExit', async () => {
  console.log('👋🏼 Shutting down Prisma server')
})

export default prisma
