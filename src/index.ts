import express from 'express'
import helmet from 'helmet'
import prisma from './client'
import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import rootstockRoutes from './routes/rootstock'
import customerRoutes from './routes/customer'
import propertyRoutes from './routes/property'
import greenhouseRoutes from './routes/greenhouse'
import fruitsOrdersRoutes from './routes/fruitsOrders'
import orderPaymentsRoutes from './routes/orderPayments'
import bcrypt from 'bcryptjs'

const PORT = process.env.PORT || 8080
const app = express()

app.use(helmet())
app.use(express.json())

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  next()
})

app.use('/api', authRoutes)
app.use('/api', userRoutes)
app.use('/api', rootstockRoutes)
app.use('/api', propertyRoutes)
app.use('/api', customerRoutes)
app.use('/api', greenhouseRoutes)
app.use('/api', fruitsOrdersRoutes)
app.use('/api', orderPaymentsRoutes)

app.listen(PORT, async () => {
  console.log(`Running on ${PORT} ⚡`)

  const user = await prisma.user.findUnique({ where: { email: process.env.ROOT_EMAIL } })

  if (!user) {
    const hashedPw = await bcrypt.hash(process.env.ROOT_PASS + '', 12)
    return await prisma.user.create({
      data: {
        name: 'root',
        email: process.env.ROOT_EMAIL + '',
        password: hashedPw,
        isSuperuser: true
      }
    })
  }
})
