import { Sequelize } from 'sequelize-typescript'
import Phonebook from '../models/phonebook'
import Rootstock from '../models/rootstock'
import User from '../models/user'
import UserPhonebook from '../models/userPhonebook'

const sequelize = new Sequelize('agro-master', process.env.DB_USER + '', process.env.DB_PASS, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  models: [Rootstock, User, Phonebook, UserPhonebook]
})

export default sequelize
