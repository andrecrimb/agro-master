import { DataTypes } from 'sequelize'

export const modelAttrDefaults = {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    autoIncrement: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}
