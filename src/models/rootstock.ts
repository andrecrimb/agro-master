import { Optional } from 'sequelize'
import { CreationOptionals, ModelAttrDefaults } from '../types/sequelize'
import { Table, Column, Model, AllowNull, NotEmpty } from 'sequelize-typescript'

type RootstockAttributes = ModelAttrDefaults & {
  name: string
}

interface RootstockCreationAttributes extends Optional<RootstockAttributes, CreationOptionals> {}

@Table
class Rootstock extends Model<RootstockAttributes, RootstockCreationAttributes> {
  @AllowNull(false)
  @NotEmpty
  @Column
  name: string
}

export default Rootstock
