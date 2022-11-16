import { RequestHandler } from "express";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import dotenv from "dotenv";

import Product, { IProduct } from "../models/product";
import Order from "../models/order";
import DataError from "../util/customError";
import Stripe from "stripe";

const ITEMS_PER_PAGE = 1;
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2022-08-01",
});

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const page = +req.query.page! || 1;

    const totalItems = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render(path.join("shop", "product-list"), {
      prods: products,
      pageTitle: "Products",
      path: "/products",
      currentPage: page,
      hasNextPage: page * ITEMS_PER_PAGE < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
    const page = +req.query.page! || 1;

    const totalItems = await Product.find().countDocuments();

    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    res.render(path.join("shop", "index"), {
      prods: products,
      pageTitle: "Shop",
      path: "/",
      currentPage: page,
      hasNextPage: page * ITEMS_PER_PAGE < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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

export const getCheckout: RequestHandler = async (req, res, next) => {
  try {
    const user = await req.user.populate<{
      cart: { productId: IProduct; quantity: number }[];
    }>("cart.productId");

    const products = user.cart;
    let totalPrice = 0;

    products.forEach((e) => {
      totalPrice += e.quantity * e.productId.price;
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: products.map((product) => {
        const p = product.productId;

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.title,
              description: p.description,
            },
            unit_amount: Math.round(p.price * 100),
          },
          quantity: product.quantity,
        };
      }),
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/checkout/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/checkout/cancel`,
    });
    res.status(303).redirect(session.url!);

    // res.render("shop/checkout", {
    //   path: "/checkout",
    //   pageTitle: "Checkout",
    //   products: products,
    //   totalPrice: totalPrice,
    //   key: process.env.STRIPE_KEY,
    //   sessionId: session.id,
    // });
  } catch (err) {
    next(err);
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
    let totalPrice = 0;

    if (!order) {
      return next(new Error("No order found"));
    }

    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error("Unauthorised"));
    }

    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("invoices", invoiceName);

    const pdfDoc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);

    pdfDoc.fontSize(26).text("invoice");
    pdfDoc.text("----------------------------------");

    order.items.forEach((product) => {
      totalPrice += product.quantity * product.price;
      pdfDoc
        .fontSize(16)
        .text(`${product.title} - ${product.quantity} x $${product.price}`);
    });

    pdfDoc.fontSize(20).text("----------");

    pdfDoc.fontSize(16).text(`Total price: $${totalPrice.toFixed(2)}`);

    pdfDoc.end();
  } catch (err) {
    next(err);
  }
};
