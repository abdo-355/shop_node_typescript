import { Table, Column, Model, DataType } from "sequelize-typescript";

const { INTEGER, STRING, DOUBLE } = DataType;

@Table
class Product extends Model {
  @Column({
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: STRING,
  })
  description: string;

  @Column({
    type: STRING,
    allowNull: false,
  })
  imgurl: string;

  @Column({
    type: DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({
    type: INTEGER,
    allowNull: false,
  })
  userId: number;
}

export default Product;
