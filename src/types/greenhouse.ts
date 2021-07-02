import { CreationIgnoreKeys } from './common'
import { Greenhouse, SeedlingBench } from '@prisma/client'

export type AddGreenhouseBody = Omit<Greenhouse, CreationIgnoreKeys> & {}
export type EditGreenhouseBody = Omit<Greenhouse, CreationIgnoreKeys> & {}

export type AddBenchBody = Omit<SeedlingBench, CreationIgnoreKeys> & {}
export type EditBenchBody = Omit<SeedlingBench, CreationIgnoreKeys> & {}
