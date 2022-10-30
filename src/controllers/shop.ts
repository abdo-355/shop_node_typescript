import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";
import Order from "../models/order";

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
    .then((data: any) => {
      res.redirect("/cart");
    })
    .catch((err: Error) => console.log(err));
};

export const getOrders: RequestHandler = (req, res, next) => {
  Order.find()
    .then((orders) => {
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
    .populate("cart.productId")
    .then((user) => {
      const products = user.cart.map((item) => {
        return { ...item.productId, quantity: item.quantity };
      });
      const order = new Order({
        user: { name: req.user.name, userId: req.user._id },
        items: products,
      });

      return order.save();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
