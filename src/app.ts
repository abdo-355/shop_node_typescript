import path from "path";
import express, { RequestHandler } from "express";
import bodyParser from "body-parser";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import db from "./util/database";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// get data from the database
db.execute("SELECT * FROM products")
  .then((result) => {
    console.log(result[0], result[1]);
  })
  .catch((err) => {
    if (err) {
      console.log(err);
    }
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(get404controller);

app.listen(3000);
