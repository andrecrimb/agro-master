import sequelize from '../config/sequelize'
import { DataTypes, Model, Optional } from 'sequelize'
import { modelAttrDefaults } from '../utils/sequelize'
import { ModelAttrDefaults, CreationOptionals } from '../types/sequelize'

type PhonebookAttributes = ModelAttrDefaults & {
  label: string
  phoneNumber: string
}

interface PhonebookCreationAttributes extends Optional<PhonebookAttributes, CreationOptionals> {}

interface PhonebookInstance
  extends Model<PhonebookAttributes, PhonebookCreationAttributes>,
    PhonebookAttributes {}

const Phonebook = sequelize.define<PhonebookInstance>('Phonebook', {
  ...modelAttrDefaults,
  label: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

export default Phonebook
