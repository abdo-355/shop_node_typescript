import path from "path";
import { products } from "./admin";

import express, { RequestHandler } from "express";

import rootDir from "../util/path";

const router = express.Router();

router.get<RequestHandler>("/", (req, res, next) => {
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
  // res.sendFile(path.join(rootDir, "..", "views", "shop.html"));
});

export default router;
