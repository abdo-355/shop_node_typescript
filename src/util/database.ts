import { Sequelize } from "sequelize-typescript";

import Product from "../models/product";
import Cart from "../models/cart";
import User from "../models/user";
import CartItem from "../models/cart-item";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  database: "node_w/_sql",
  username: "root",
  password: process.env.DB_PASSWORD,
  models: [Product, User, Cart, CartItem],
});

export default sequelize;
