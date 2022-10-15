import path from "path";
import express from "express";
import bodyParser from "body-parser";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import sequelize from "./util/database";
import Product from "./models/product";
import User from "./models/user";
import { Sequelize } from "sequelize";
import { Model } from "sequelize-typescript";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// add user to the request globaly
declare global {
  namespace Express {
    interface Request extends Model {
      user?: any;
    }
  }
}

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    User.findByPk(1)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((err) => console.log(err));
  }
);

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404controller);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

sequelize
  .sync()
  .then((res) => {
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({
        name: "testUser",
        email: "user@test.com",
      });
    }

    return user;
  })
  .then((user) => {
    // console.log(user);

    // only listen if the connection succeded
    app.listen(3000);
  })
  .catch((err) => console.log(err));
