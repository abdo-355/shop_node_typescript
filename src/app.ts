import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose, { HydratedDocument } from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import csurf from "csurf";
import flash from "connect-flash";
import multer from "multer";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import authRoutes from "./routes/auth";
import * as errorController from "./controllers/error";
import User, { IUser } from "./models/user";
import DataError from "./util/customError";

const app = express();
dotenv.config();
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  collectionName: "sessions",
});
const csrfProtection = csurf();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: "images" }).single("image"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

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

      if (!user) {
        return next();
      }

      req.user = user;

      next();
    } catch (err) {
      const error = new DataError(err, 500);
      return next(error);
    }
  }
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use(
  (
    error: DataError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.redirect("/500");
  }
);

const startConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    app.listen(3000);
  } catch (err) {
    console.log(err);
  }
};

startConnection();
