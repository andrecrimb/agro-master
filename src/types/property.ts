import { CreationIgnoreKeys } from './common'
import { Property } from '@prisma/client'

export type AddOwnerPropertyBody = Omit<Property, CreationIgnoreKeys> & {}
