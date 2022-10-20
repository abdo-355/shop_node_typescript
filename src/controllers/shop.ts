import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";
import Cart from "../models/cart";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.findAll()
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
  const productId = req.params.productId as string;
  Product.findByPk(productId).then((product) => {
    res.render(path.join("shop", "product-detail"), {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
};

export const getIndex: RequestHandler = (req, res, next) => {
  Product.findAll()
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

interface shownCartProducts extends Product {
  quantity: number;
}

export const getCart: RequestHandler = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => {
      console.log(products);
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
  let fetchedCart;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      let newQuantity = 1;

      if (product) {
        // TODO: change the quantity
      }
      return Product.findByPk(productId)
        .then((product) =>
          fetchedCart.addProduct(product, {
            through: { quantity: newQuantity },
          })
        )
        .catch((err) => console.log(err));
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
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
