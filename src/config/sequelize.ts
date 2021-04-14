import { Sequelize } from 'sequelize'

const dbConfig = new Sequelize('agro-master', process.env.DB_USER + '', process.env.DB_PASS, {
  dialect: 'mysql',
  host: process.env.DB_HOST
})

export default dbConfig
