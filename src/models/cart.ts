import fs from "fs";
import path from "path";

import Product from "./product";
import rootpath from "../util/path";

const p = path.join(rootpath, "data", "cart.json");

interface CartProduct {
  id: string;
  quantity: number;
}

export interface CartObject {
  products: CartProduct[];
  totalPrice: number;
}

class Cart {
  static addProduct = (id: string, price: string) => {
    // fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart: CartObject = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent.toString());
      }

      // analyze the cart => find existing product
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      // add new product/increase the quantity
      let updatedProduct: CartProduct;
      if (existingProduct) {
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += +price;

      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  };

  static deleteProductById = (id: string, productPrice: string) => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return;
      }
      const cart: CartObject = JSON.parse(fileContent.toString());
      const updatedCart = { ...cart };
      const product = updatedCart.products.find((product) => product.id === id);
      if (!product) {
        return;
      }
      const productQty = product!.quantity;

      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice -= +productPrice * productQty;

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log(err);
        }
      });
    });
  };

  static getCart = (cb: Function) => {
    fs.readFile(p, (err, fileContent) => {
      const cart = JSON.parse(fileContent.toString());
      if (err) {
        cb(null);
      } else {
        cb(cart);
      }
    });
  };
}

export default Cart;
