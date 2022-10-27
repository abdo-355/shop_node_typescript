import path from "path";
import express from "express";
import bodyParser from "body-parser";
import { WithId, Document } from "mongodb";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
import { mongoConnect } from "./util/database";
import User from "./models/user";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

declare global {
  namespace Express {
    interface Request {
      user?: WithId<Document>;
    }
  }
}

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    User.findById("635aafa6bb59294f9179a0fc")!
      .then((user) => {
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

mongoConnect();

app.listen(3000);
