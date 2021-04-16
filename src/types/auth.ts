import { PhoneNumber, User } from '@prisma/client'
import { CreationIgnoreKeys } from './common'

export type AuthTokenPayload = {
  email: string
  id: number
}

export type AddUserBody = Omit<User, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}
