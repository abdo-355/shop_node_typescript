import path from "path";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";

import adminRoutes from "./routes/admin";
import shopRoutes from "./routes/shop";
import get404controller from "./controllers/404";
// import User from "./models/user";

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

// app.use(
//   (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     User.findById("635aafa6bb59294f9179a0fc")!
//       .then((user) => {
//         if (user) {
//           req.user = new User(user.name, user.email, user.cart, user._id);
//         }
//         next();
//       })
//       .catch((err) => console.log(err));
//   }
// );

app.use("/admin", adminRoutes);

app.use(shopRoutes);

app.use(get404controller);

mongoose
  .connect(
    `mongodb+srv://abdo:${process.env.MONGO_PASSWORD}@learningmongo.xn38cbo.mongodb.net/LearningMongo?retryWrites=true&w=majority`
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
