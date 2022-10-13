import mysql from "mysql2";

import * as dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_w/_sql",
  port: 3306,
  password: process.env.DB_PASSWORD,
});

export default pool.promise();
