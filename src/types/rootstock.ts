import { CreationIgnoreKeys } from './common'
import { Rootstock } from '@prisma/client'

export type AddRootstockBody = Omit<Rootstock, CreationIgnoreKeys>
export type EditRootstockBody = Omit<Rootstock, CreationIgnoreKeys>
