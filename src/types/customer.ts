import { CreationIgnoreKeys } from './common'
import { Customer, PhoneNumber, Property } from '@prisma/client'

export type AddCustomerBody = Omit<Customer, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}
export type EditCustomerBody = Omit<Customer, CreationIgnoreKeys> & {
  phoneNumbers: Omit<PhoneNumber, CreationIgnoreKeys>[]
}

export type AddCustomerPropertyBody = Omit<Property, CreationIgnoreKeys>
export type EditCustomerPropertyBody = Omit<Property, CreationIgnoreKeys>
