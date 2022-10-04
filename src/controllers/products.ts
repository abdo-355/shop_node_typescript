import { RequestHandler } from "express";

interface Product {
  title: string;
}

export const products: Product[] = [];

export const getAddProduct: RequestHandler = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

export const postAddProduct: RequestHandler = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

export const getProducts: RequestHandler = (req, res, next) => {
  res.render("shop", { prods: products, pageTitle: "Shop", path: "/" });
};
