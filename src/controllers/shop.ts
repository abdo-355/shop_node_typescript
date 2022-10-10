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

export const getProduct: RequestHandler = (req, res, next) => {
  const prodId = req.params.productId as string;
  Product.findProductById(prodId, (product: Product) => {
    res.render(path.join("shop", "product-detail"), {
      product: product,
      pageTitle: product.title,
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

export const postCart: RequestHandler = (req, res, next) => {
  const prodId = req.body.productId;
  console.log(prodId);
  res.redirect("/cart");
};

export const getOrders: RequestHandler = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

export const getCheckout: RequestHandler = (req, res, next) => {
  res.render(path.join("shop", "checkout"), {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
