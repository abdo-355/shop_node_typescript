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
        isAuthenticated: req.session.isLoggedIn,
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
      isAuthenticated: req.session.isLoggedIn,
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
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
};

export const getCart: RequestHandler = (req, res, next) => {
  req.session
    .user!.populate("cart.productId")
    .then((user) => {
      res.render(path.join("shop", "cart"), {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postCart: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    .then((product) => {
      return req.session.user!.addToCart(product!);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

export const postDeleteItem: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;

  req.session
    .user!.removeFromCart(productId)
    .then((data: any) => {
      res.redirect("/cart");
    })
    .catch((err: Error) => console.log(err));
};

export const getOrders: RequestHandler = (req, res, next) => {
  Order.find({ "user.userId": req.session.user!._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postOrder: RequestHandler = (req, res, next) => {
  req.session
    .user!.populate("cart.productId")
    .then((user) => {
      const products = user.cart.map((item) => {
        return { ...item.productId, quantity: item.quantity };
      });
      const order = new Order({
        user: { name: req.session.user!.name, userId: req.session.user!._id },
        items: products,
      });

      return order.save();
    })
    .then((result) => {
      return req.session.user!.clearCart();
    })
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};
