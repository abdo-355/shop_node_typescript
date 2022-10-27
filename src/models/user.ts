import { ObjectId } from "mongodb";

import { getDb } from "../util/database";

class User {
  constructor(public name: string, public email: string) {
    this.name = name;
    this.email = email;
  }

  save = () => {
    const db = getDb();
    return db?.collection("users").insertOne(this);
  };

  public static findById = (userId: string) => {
    const db = getDb();
    return db?.collection("users").findOne({ _id: new ObjectId(userId) });
  };
}

export default User;
