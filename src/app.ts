import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { Model } from "sequelize";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import sequelize from "./util/database";
import Product from "./models/product";
import User from "./models/user";
import Cart from "./models/cart";
import CartItem from "./models/cart-item";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// add user to the request globaly
declare global {
  namespace Express {
    interface Request extends Model {
      user?: User;
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

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
});
User.hasMany(Product, { foreignKey: "userId" });
User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId" });
Cart.belongsToMany(Product, { through: CartItem, foreignKey: "cartId" });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: "cartId" });

sequelize
  .sync({ force: true })
  // .sync()
  .then((res) => {
    console.log(User.findByPk(1));
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
    return user.createCart();
  })
  .then((cart) => {
    // only listen if the connection succeded
    app.listen(3000);
  })
  .catch((err) => console.log(err));
