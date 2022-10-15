import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class Cart extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;
}

export default Cart;
