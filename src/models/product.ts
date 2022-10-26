import { getDb } from "../util/database";

class Product {
  public title: string;
  public price: number;
  public imgUrl: string;
  public description: string;

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

  public save() {
    const db = getDb();
    return db?.collection("products").insertOne(this);
  }

  public static fetchAll = () => {
    const db = getDb();
    return db?.collection("products").find().toArray();
  };
}

export default Product;
