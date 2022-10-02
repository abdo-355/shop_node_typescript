import path from "path";

import express, { RequestHandler } from "express";
import bodyParser from "body-parser";

const app = express();

import * as adminData from "./routes/admin";
import shopRoutes from "./routes/shop";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/admin", adminData.router);
app.use(shopRoutes);

app.use<RequestHandler>((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "..", "views", "404.html"));
});

app.listen(3000);
