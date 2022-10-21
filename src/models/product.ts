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

class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare price: number;
  declare imgurl: string;
  declare description: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare userId: ForeignKey<User["id"]>;
  declare user?: NonAttribute<User>;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    imgurl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, tableName: "products" }
);

export default Product;
