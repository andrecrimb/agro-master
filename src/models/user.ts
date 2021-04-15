import Phonebook from '../models/phonebook'
import {
  Table,
  Column,
  Model as Model,
  AllowNull,
  Default,
  Unique,
  IsEmail,
  BelongsToMany
} from 'sequelize-typescript'
import UserPhonebook from './userPhonebook'
import { CreationOptionals, ModelAttrDefaults } from '../types/sequelize'
import { Optional } from 'sequelize'

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

@Table
class User extends Model<UserAttributes, UserCreationAttributes> {
  @AllowNull(false)
  @Column
  firstName: string

  @Default('')
  @Column
  lastName: string

  @AllowNull(false)
  @IsEmail
  @Unique
  @Column
  email: string

  @AllowNull(false)
  @Column
  password: string

  @Default(true)
  @Column
  active: boolean

  @Default('user')
  @Column
  role: 'user' | 'superuser'

  @BelongsToMany(() => Phonebook, () => UserPhonebook)
  phonebook: Phonebook[]
}

export default User
