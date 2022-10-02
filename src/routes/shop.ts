import path from "path";
import { products } from "./admin";

import express, { RequestHandler } from "express";

import rootDir from "../util/path";

const router = express.Router();

router.get<RequestHandler>("/", (req, res, next) => {
  console.log(products);
  res.render("shop");
  // res.sendFile(path.join(rootDir, "..", "views", "shop.html"));
});

export default router;
