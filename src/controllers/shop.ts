import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render(path.join("shop", "product-list"), {
        prods: products,
        pageTitle: "all products",
        path: "/products",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

export const getProduct: RequestHandler = (req, res, next) => {
  const productId = req.params.productId;
  Product.findById(productId)!.then((product) => {
    res.render(path.join("shop", "product-detail"), {
      product: product,
      pageTitle: product!.title,
      path: `/products/${productId}`,
    });
  });
};

export const getIndex: RequestHandler = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render(path.join("shop", "index"), {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

export const getCart: RequestHandler = (req, res, next) => {
  req.user
    .populate("cart.productId")
    .then((user) => {
      res.render(path.join("shop", "cart"), {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart,
      });
    })
    .catch((err) => console.log(err));
};

export const postCart: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product!);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

export const postDeleteItem: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;

  req.user
    .removeFromCart(productId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err: Error) => console.log(err));
};

export const getOrders: RequestHandler = (req, res, next) => {
  req
    .user!.getOreders()
    ?.then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

export const postOrder: RequestHandler = (req, res, next) => {
  req.user
    ?.addOrder()
    ?.then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
