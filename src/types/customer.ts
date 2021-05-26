import { CreationIgnoreKeys } from './common'
import { Customer, PhoneNumber } from '@prisma/client'

export type AddCustomerBody = Omit<Customer, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}
export type EditCustomerBody = Omit<Customer, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}
