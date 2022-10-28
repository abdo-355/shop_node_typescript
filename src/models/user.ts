import { ObjectId, WithId, Document } from "mongodb";

import { getDb } from "../util/database";

interface CartItem {
  productId: ObjectId;
  quantity: number;
}

class User {
  public name: string;
  public email: string;
  public cart: CartItem[];
  public _id: ObjectId;

  constructor(name: string, email: string, cart: CartItem[], id: ObjectId) {
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save = () => {
    const db = getDb();
    return db?.collection("users").insertOne(this);
  };

  addToCart = (product: WithId<Document>) => {
    const db = getDb();
    let updatedCartItems = [...this.cart];
    let newQuantity = 1;

    const cartProductIndex = this.cart.findIndex(
      (cp) => cp.productId.toString() === product._id.toString()
    );

    if (cartProductIndex >= 0) {
      newQuantity += this.cart[cartProductIndex].quantity;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({ productId: product._id, quantity: 1 });
    }

    return db
      ?.collection("users")
      .updateOne({ _id: this._id }, { $set: { cart: updatedCartItems } });
  };

  public static findById = (userId: string) => {
    const db = getDb();
    return db?.collection("users").findOne({ _id: new ObjectId(userId) });
  };
}

export default User;
