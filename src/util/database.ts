import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let _db: Db;

export const mongoConnect = () => {
  MongoClient.connect(
    `mongodb+srv://abdo:${process.env.MONGO_PASSWORD}@learningmongo.xn38cbo.mongodb.net/LearningMongo?retryWrites=true&w=majority`
  )
    .then((client) => {
      _db = client.db();
    })
    .catch((err) => console.log(err));
};

export const getDb = () => {
  if (_db) {
    return _db;
  }
  console.log("No database found");
};
