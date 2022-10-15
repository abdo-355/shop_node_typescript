import { Sequelize } from "sequelize-typescript";
import Product from "../models/product";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "mysql",
  database: "node_w/_sql",
  username: "root",
  password: process.env.DB_PASSWORD,
  models: [Product],
});

export default sequelize;
