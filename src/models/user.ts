import { Table, Column, Model, DataType } from "sequelize-typescript";

const { INTEGER, STRING } = DataType;

@Table
class User extends Model {
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
  name: string;

  @Column({
    type: STRING,
  })
  email: string;
}

export default User;
