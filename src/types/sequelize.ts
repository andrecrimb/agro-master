import { Model } from 'sequelize/types'

export interface SequelizeModel extends Model {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type ModelAttrDefaults = {
  id: string
  createdAt: Date
  updatedAt: Date
}

export type CreationOptionals = 'id' | 'updatedAt' | 'createdAt'
