import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
} from "sequelize";

import sequelize from "../util/database";
import Product from "./product";
import Cart from "./cart";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare getProducts: HasManyGetAssociationsMixin<Product>;
  declare createProduct: HasManyCreateAssociationMixin<Product>;

  declare getCart: HasOneGetAssociationMixin<Cart>;
  declare createCart: HasOneCreateAssociationMixin<Cart>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: "users" }
);

export default User;
