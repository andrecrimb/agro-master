import express from 'express'
import helmet from 'helmet'
import sequelize from './config/sequelize'
import authRoutes from './routes/auth'
import rootstockRoutes from './routes/rootstock'
import User from './models/user'
import bcrypt from 'bcryptjs'

const PORT = process.env.PORT || 8080
const app = express()

app.use(helmet())
app.use(express.json())

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  next()
})

app.use(authRoutes)
app.use(rootstockRoutes)

sequelize
  // .sync({ force: true })
  .sync()
  .then(async () => {
    const user = await User.findOne({ where: { email: process.env.ROOT_EMAIL } })

    if (!user) {
      const hashedPw = await bcrypt.hash(process.env.ROOT_PASS + '', 12)
      return User.create({
        firstName: 'root',
        email: process.env.ROOT_EMAIL + '',
        password: hashedPw,
        role: 'superuser'
      })
    }
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))
  })
  .catch(err => {
    console.log('Sequelize', err)
  })
