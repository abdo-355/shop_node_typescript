import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  "node_w/_sql",
  "root",
  process.env.DB_PASSWORD,
  { dialect: "mysql", host: "localhost", port: 3306 }
);

export default sequelize;
