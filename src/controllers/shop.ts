import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";
import Cart, { CartObject } from "../models/cart";

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
  const productId = req.params.productId as string;
  Product.findProductById(productId, (product: Product) => {
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

interface shownCartProducts extends Product {
  quantity: number;
}

export const getCart: RequestHandler = (req, res, next) => {
  Cart.getCart((cart: CartObject) => {
    Product.fetchAll((products: Product[]) => {
      const cartProducts: shownCartProducts[] = [];
      for (let product of products) {
        const cartProductData = cart.products.find(
          (prod) => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ ...product, quantity: cartProductData.quantity });
        }
      }

      res.render(path.join("shop", "cart"), {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cartProducts,
      });
    });
  });
};

export const postCart: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId, (product: Product) => {
    Cart.addProduct(productId, product.price);
  });
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
