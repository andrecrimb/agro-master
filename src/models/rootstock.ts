import { DataTypes } from 'sequelize'
import sequelize from '../config/sequelize'
import { SequelizeModel } from '../types/sequelize'

interface RootstockInstance extends SequelizeModel {
  name: string
}

const Rootstock = sequelize.define<RootstockInstance>('Rootstock', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

export default Rootstock
