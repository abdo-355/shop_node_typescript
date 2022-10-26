import { getDb } from "../util/database";

class Product {
  title: string;
  price: number;
  imgUrl: string;
  description: string;

  constructor(
    title: string,
    price: number,
    imgUrl: string,
    description: string
  ) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
  }

  save() {
    const db = getDb();
    db?.collection("products")
      .insertOne(this)
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
}

export default Product;
