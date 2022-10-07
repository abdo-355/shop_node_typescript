import { RequestHandler } from "express";

import Product from "../models/product";

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct: RequestHandler = (req, res, next) => {
  const product = new Product((req.body as { title: string }).title);
  product.save();
  res.redirect("/");
};

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll((products: Product[]) => {
    res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
  });
};
