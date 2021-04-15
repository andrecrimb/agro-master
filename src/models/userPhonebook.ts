// import { DataTypes, Model, Optional } from 'sequelize'
import { Table, Column, Model as Model, ForeignKey } from 'sequelize-typescript'
import User from './user'
import Phonebook from './phonebook'

@Table
export class UserPhonebook extends Model {
  @ForeignKey(() => User)
  @Column
  userId: number

  @ForeignKey(() => Phonebook)
  @Column
  phonebookId: number
}

export default UserPhonebook
