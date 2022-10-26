import { RequestHandler } from "express";
import path from "path";

import Product from "../models/product";
import Cart from "../models/cart";

export const getProducts: RequestHandler = (req, res, next) => {
  Product.fetchAll()!
    .then((products) => {
      console.log(products);
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

// export const getProduct: RequestHandler = (req, res, next) => {
//   const productId = req.params.productId as string;
//   Product.findByPk(productId).then((product) => {
//     res.render(path.join("shop", "product-detail"), {
//       product: product,
//       pageTitle: product!.title,
//       path: "/products",
//     });
//   });
// };

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

// export const getCart: RequestHandler = (req, res, next) => {
//   req
//     .user!.getCart()
//     .then((cart) => cart.getProducts())
//     .then((products) => {
//       res.render(path.join("shop", "cart"), {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: products,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// export const postCart: RequestHandler = (req, res, next) => {
//   const productId = req.body.productId;
//   let fetchedCart: Cart;
//   let newQuantity = 1;

//   req
//     .user!.getCart()
//     .then((cart) => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then((products) => {
//       let product;
//       if (products.length > 0) {
//         product = products[0];
//       }

//       if (product) {
//         const oldQuantity = product.cartItem!.quantity;
//         newQuantity += oldQuantity;
//         return product;
//       }
//       return Product.findByPk(productId);
//     })
//     .then((product) => {
//       if (product) {
//         return fetchedCart.addProduct(product, {
//           through: { quantity: newQuantity },
//         });
//       }
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

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
