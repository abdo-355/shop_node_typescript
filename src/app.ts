import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose, { HydratedDocument } from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import get404controller from "./controllers/404";
import User, { IUser } from "./models/user";

const app = express();
dotenv.config();

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

declare global {
  namespace Express {
    export interface Request {
      user: HydratedDocument<IUser>;
    }
  }
}

app.use(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      if (!req.session.user) {
        return next();
      }

      const user = await User.findById(req.session.user?._id);

      req.user = user!;
      next();
    } catch (err) {
      console.log(err);
    }
  }
);

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(get404controller);

const startConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

startConnection();
