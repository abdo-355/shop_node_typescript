import { DOUBLE, INTEGER, STRING } from "sequelize";

import sequelize from "../util/database";

const Product = sequelize.define("products", {
  id: {
    type: INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: STRING,
    allowNull: false,
  },
  price: {
    type: DOUBLE,
    allowNull: false,
  },
  imgUrl: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: false,
  },
});

export default Product;
