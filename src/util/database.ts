import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoConnect = (cb: Function) => {
  MongoClient.connect(
    `mongodb+srv://abdo:${process.env.MONGO_PASSWORD}@learningmongo.xn38cbo.mongodb.net/?retryWrites=true&w=majority`
  )
    .then((client) => {
      cb(client);
      console.log("connected");
    })
    .catch((err) => console.log(err));
};

export default mongoConnect;
