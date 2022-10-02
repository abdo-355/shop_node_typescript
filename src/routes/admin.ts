import path from "path";

import express, { RequestHandler } from "express";

import rootDir from "../util/path";

const router = express.Router();

interface Product {
  title: string;
}

const products: Product[] = [];
// /admin/add-product => GET
router.get<RequestHandler>("/add-product", (req, res, next) => {
  res.render("add-product", { docTitle: "Add Product" });
});

// /admin/add-product => POST
router.post<RequestHandler>("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

export { router, products };
