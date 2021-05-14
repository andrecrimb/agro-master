import { PhoneNumber, User } from '@prisma/client'
import { CreationIgnoreKeys } from './common'

export type AddUserBody = Omit<User, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}

export type EditUserBody = Omit<User, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}
