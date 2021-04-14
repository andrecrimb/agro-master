import { DataTypes } from 'sequelize'
import sequelize from '../config/sequelize'

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
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
    type: DataTypes.ENUM('admin', 'operator'),
    defaultValue: 'admin'
  }
})

export default User
