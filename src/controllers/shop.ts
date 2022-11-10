import { RequestHandler } from "express";
import path from "path";
import fs from "fs";

import Product from "../models/product";
import Order from "../models/order";
import DataError from "../util/customError";

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render(path.join("shop", "product-list"), {
      prods: products,
      pageTitle: "all products",
      path: "/products",
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);

    res.render(path.join("shop", "product-detail"), {
      product: product,
      pageTitle: product!.title,
      path: `/products/${productId}`,
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getIndex: RequestHandler = async (req, res, next) => {
  try {
    const products = await Product.find();

    res.render(path.join("shop", "index"), {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.productId");

    res.render(path.join("shop", "cart"), {
      path: "/cart",
      pageTitle: "Your Cart",
      products: user.cart,
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postCart: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId;

    const product = await Product.findById(productId);

    await req.user.addToCart(product!);

    res.redirect("/cart");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postDeleteItem: RequestHandler = async (req, res, next) => {
  try {
    const productId = req.body.productId;

    await req.user.removeFromCart(productId);

    res.redirect("/cart");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await Order.find({ "user.userId": req.user!._id });

    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: orders,
    });
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const postOrder: RequestHandler = async (req, res, next) => {
  try {
    const user = await req.user.populate("cart.productId");

    const products = user.cart.map((item) => {
      return { ...item.productId, quantity: item.quantity };
    });
    const order = new Order({
      user: { name: req.user!.name, userId: req.user!._id },
      items: products,
    });

    await order.save();

    await req.user!.clearCart();

    res.redirect("/orders");
  } catch (err) {
    const error = new DataError(err, 500);
    return next(error);
  }
};

export const getInvoice: RequestHandler = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findById(orderId);

    if (!order) {
      return next(new Error("No order found"));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorised"));
    }

    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("invoices", invoiceName);

    const file = fs.createReadStream(invoicePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attach; filename="${invoiceName}"`);

    file.pipe(res);
  } catch (err) {
    next(err);
  }
};
