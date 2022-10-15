import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table
class CartItem extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column(DataType.INTEGER)
  quantity: number;
}

export default CartItem;
