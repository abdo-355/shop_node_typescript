import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node_w/_sql",
  password: process.env.DB_PASSWORD,
});

export default pool.promise();
