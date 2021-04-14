import express from 'express'
import helmet from 'helmet'
import sequelize from './config/sequelize'
import authRoutes from './routes/auth'
import rootstockRoutes from './routes/rootstock'

const PORT = process.env.PORT || 8080
const app = express()

app.use(helmet())
app.use(express.json())

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.use(authRoutes)
app.use(rootstockRoutes)

sequelize
  .sync()
  // .sync({ force: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))
  })
  .catch(err => {
    console.log('Sequelize', err)
  })
