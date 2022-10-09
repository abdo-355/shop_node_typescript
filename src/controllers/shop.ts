import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll((products: Product[]) => {
    res.render(path.join("shop", "product-list"), {
      prods: products,
      pageTitle: "all products",
      path: "/products",
    });
  });
};

export const getIndex: RequestHandler = (req, res, next) => {
  Product.fetchAll((products: Product[]) => {
    res.render(path.join("shop", "index"), {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

export const getCart: RequestHandler = (req, res, next) => {
  res.render(path.join("shop", "cart"), {
    path: "/cart",
    pageTitle: "Your Cart",
  });
};

export const getCheckout: RequestHandler = (req, res, next) => {
  res.render(path.join("shop", "checkout"), {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
