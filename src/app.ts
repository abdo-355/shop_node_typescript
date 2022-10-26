import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import mongoConnect from "./util/database";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    //   User.findByPk(1)
    //     .then((user) => {
    //       if (user) {
    //         req.user = user;
    //       }
    //       next();
    //     })
    //     .catch((err) => console.log(err));
  }
);

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(get404controller);

mongoConnect((client: MongoClient) => {
  console.log(client);
  app.listen(3000);
});
