import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  DataTypes,
} from "sequelize";

import User from "./user";
import sequelize from "../util/database";

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare userId: ForeignKey<User["id"]>;
  declare user?: NonAttribute<User>;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "carts" }
);

export default Cart;
