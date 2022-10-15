import { Sequelize } from "sequelize-typescript";
import Product from "../models/product";

import dotenv from "dotenv";
import User from "../models/user";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  database: "node_w/_sql",
  username: "root",
  password: process.env.DB_PASSWORD,
  models: [Product, User],
});

export default sequelize;
