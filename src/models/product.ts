import { ObjectId } from "mongodb";

import { getDb } from "../util/database";

class Product {
  public title: string;
  public price: number;
  public imgUrl: string;
  public description: string;
  public userId: ObjectId;
  public _id?: ObjectId;

  constructor(
    title: string,
    price: number,
    imgUrl: string,
    description: string,
    id: string | null,
    userId: ObjectId
  ) {
    this.title = title;
    this.price = price;
    this.imgUrl = imgUrl;
    this.description = description;
    this.userId = userId;
    if (id) {
      this._id = new ObjectId(id);
    }
  }

  public save = () => {
    const db = getDb();
    if (this._id) {
      return db
        ?.collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      return db?.collection("products").insertOne(this);
    }
  };

  public static fetchAll = () => {
    const db = getDb();
    return db?.collection("products").find().toArray();
  };

  public static findById = (productId: string) => {
    const db = getDb();
    return db
      ?.collection("products")
      .find({ _id: new ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  };

  public static deletebyId = (productId: string) => {
    const db = getDb();
    return db
      ?.collection("products")
      .deleteOne({ _id: new ObjectId(productId) });
  };
}

export default Product;
