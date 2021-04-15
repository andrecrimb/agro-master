import { Table, Column, Model, AllowNull, BelongsToMany } from 'sequelize-typescript'
import { Optional } from 'sequelize'
import { CreationOptionals, ModelAttrDefaults } from '../types/sequelize'
import User from './user'
import UserPhonebook from './userPhonebook'

type PhonebookAttributes = ModelAttrDefaults & {
  label: string
  phoneNumber: string
}

interface PhonebookCreationAttributes extends Optional<PhonebookAttributes, CreationOptionals> {}
@Table
class Phonebook extends Model<PhonebookAttributes, PhonebookCreationAttributes> {
  @AllowNull(false)
  @Column
  label: string

  @AllowNull(false)
  @Column
  phoneNumber: string

  @BelongsToMany(() => User, () => UserPhonebook)
  users: User[]
}

export default Phonebook
