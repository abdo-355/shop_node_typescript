import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  DataTypes,
} from "sequelize";

import Product from "./product";
import Cart from "./cart";

import sequelize from "../util/database";

class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;

  declare quantity: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare cartId: ForeignKey<Cart["id"]>;
  declare productId: ForeignKey<Product["id"]>;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "cartitems" }
);

export default CartItem;
