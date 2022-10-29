import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose, { HydratedDocument } from "mongoose";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import User, { IUser } from "./models/user";

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

declare global {
  namespace Express {
    export interface Request {
      user: HydratedDocument<IUser>;
    }
  }
}

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    User.findById("635d74c551112c2d76512228")
      .then((user) => {
        console.log(user);
        if (user) {
          req.user = user;
        }
        next();
      })
      .catch((err) => console.log(err));
  }
);

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(get404controller);

mongoose
  .connect(
    `mongodb+srv://abdo:${process.env.MONGO_PASSWORD}@learningmongo.xn38cbo.mongodb.net/LearningMongo?retryWrites=true&w=majority`
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        user = new User({
          name: "testUser",
          email: "user@test.com",
          cart: [],
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch((err) => console.log(err));
