import db from "../util/database";

import Cart from "./cart";

class Product {
  title: string;
  imgUrl: string;
  description: string;
  price: string;
  id: string | null;

  constructor(
    id: string | null,
    title: string,
    imgUrl: string,
    description: string,
    price: string
  ) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    return db.execute(
      "INSERT INTO products (title, imgUrl, description, price) VALUES (?, ?, ?, ?)",
      [this.title, this.imgUrl, this.description, this.price]
    );
  };

  static fetchAll = () => {
    return db.execute("SELECT * FROM products");
  };

  static findProductById = (id: string) => {
    return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);
  };

  static deleteProduct = (id: string) => {};
}

export default Product;
