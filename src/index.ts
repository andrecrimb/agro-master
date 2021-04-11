import express from 'express'
import userRoutes from './routes/user'
import dotenv from 'dotenv'
import helmet from 'helmet'

dotenv.config()

const PORT = process.env.PORT || 8080
const app = express()

app.use(helmet())
app.use(express.json())

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.use(userRoutes)

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`))
