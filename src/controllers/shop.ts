import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";
import Cart, { CartObject } from "../models/cart";
import { title } from "process";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
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
  const productId = req.params.productId as string;
  Product.findProductById(productId).then(([product]) => {
    res.render(path.join("shop", "product-detail"), {
      product: product[0],
      pageTitle: product[0].title,
      path: "/products",
    });
  });
};

export const getIndex: RequestHandler = (req, res, next) => {
  Product.fetchAll()
    .then(([products, fieldData]) => {
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

interface shownCartProducts extends Product {
  quantity: number;
}

export const getCart: RequestHandler = (req, res, next) => {
  Cart.getCart((cart: CartObject) => {
    Product.fetchAll()
      .then(([products]) => {
        const cartProducts: shownCartProducts[] = [];
        for (let i = 0; i < (products as Product[]).length; i++) {
          const cartProductData = cart.products.find(
            (prod) => prod.id === products[i].id
          );
          if (cartProductData) {
            cartProducts.push({
              ...products[i],
              quantity: cartProductData.quantity,
            });
          }
        }

        res.render(path.join("shop", "cart"), {
          path: "/cart",
          pageTitle: "Your Cart",
          products: cartProducts,
        });
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        }
      });
  });
};

export const postCart: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId)
    .then(([product]) => {
      Cart.addProduct(productId, product[0].price);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
  res.redirect("/cart");
};

export const postDeleteItem: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findProductById(productId)
    .then(([product]) => {
      Cart.deleteProductById(productId, product[0].price);
      res.redirect("/cart");
    })
    .catch((err) => {
      if (err) {
        console.log(err);
      }
    });
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
