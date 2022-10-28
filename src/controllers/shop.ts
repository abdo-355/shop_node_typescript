import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll()!
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
  Product.fetchAll()!
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
  req
    .user!.getCart()!
    .then((products) => {
      res.render(path.join("shop", "cart"), {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

export const postCart: RequestHandler = (req, res, next) => {
  const productId = req.body.productId;
  Product.findById(productId)
    ?.then((product) => {
      return req.user!.addToCart(product!);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// export const postDeleteItem: RequestHandler = (req, res, next) => {
//   const productId = req.body.productId;

//   req
//     .user!.getCart()
//     .then((cart) => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       const product = products[0];
//       return product.cartItem!.destroy();
//     })
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// export const getOrders: RequestHandler = (req, res, next) => {
//   res.render("shop/orders", {
//     path: "/orders",
//     pageTitle: "Your Orders",
//   });
// };

// export const getCheckout: RequestHandler = (req, res, next) => {
//   res.render(path.join("shop", "checkout"), {
//     path: "/checkout",
//     pageTitle: "Checkout",
//   });
// };
