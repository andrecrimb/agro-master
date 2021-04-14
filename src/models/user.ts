import { DataTypes, Model, Optional } from 'sequelize'
import sequelize from '../config/sequelize'
import { CreationOptionals, ModelAttrDefaults } from '../types/sequelize'
import { modelAttrDefaults } from '../utils/sequelize'
import Phonebook from '../models/phonebook'

type UserAttributes = ModelAttrDefaults & {
  firstName: string
  lastName: string
  email: string
  password: string
  active: boolean
  role: 'user' | 'superuser'
}

interface UserCreationAttributes
  extends Optional<UserAttributes, CreationOptionals | 'active' | 'lastName'> {}

interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {}

const User = sequelize.define<UserInstance>('User', {
  ...modelAttrDefaults,
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  role: {
    type: DataTypes.ENUM('user', 'superuser'),
    defaultValue: 'user'
  }
})

User.belongsToMany(Phonebook, { through: 'UserPhonebook' })
Phonebook.belongsToMany(User, { through: 'UserPhonebook' })

export default User
