import { DataTypes } from 'sequelize'
import sequelize from '../config/sequelize'

const Rootstock = sequelize.define('Rootstock', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

export default Rootstock
