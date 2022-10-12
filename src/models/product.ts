import fs, { rmSync } from "fs";
import path from "path";

import rootPath from "../util/path";
import Cart from "./cart";

const p = path.join(rootPath, "data", "products.json");

const getProductsFromFile = (cb: Function) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(fileContent.toString()));
    }
  });
};

class Product {
  title: string;
  imgUrl: string;
  description: string;
  price: string;
  id: string | null;

  constructor(
    id: string | null,
    title: string,
    imgUrl: string,
    description: string,
    price: string
  ) {
    this.id = id;
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  save = () => {
    getProductsFromFile((products: Product[]) => {
      if (this.id) {
        // update the product if we provide an id
        const existingProductindex = products.findIndex(
          (product: Product) => product.id === this.id
        );
        const updatedProducts = [...products];
        updatedProducts[existingProductindex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log(err);
        });
      } else {
        // add a new product if we don't provide an id
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log(err);
        });
      }
    });
  };

  static fetchAll = (cb: Function) => {
    getProductsFromFile(cb);
  };

  static findProductById = (id: string, cb: Function) => {
    getProductsFromFile((products: Product[]) => {
      const product = products.find((p) => {
        return p.id === id;
      });
      cb(product);
    });
  };

  static deleteProduct = (id: string) => {
    getProductsFromFile((products: Product[]) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((product) => product.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteProductById(id, +product!.price);
        }
      });
    });
  };
}

export default Product;
