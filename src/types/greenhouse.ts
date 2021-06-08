import { CreationIgnoreKeys } from './common'
import { Greenhouse } from '@prisma/client'

export type AddGreenhouseBody = Omit<Greenhouse, CreationIgnoreKeys> & {}
export type EditGreenhouseBody = Omit<Greenhouse, CreationIgnoreKeys> & {}
