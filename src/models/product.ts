import fs from "fs";
import path from "path";

import rootPath from "../util/path";

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

  public save = () => {
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

  public static fetchAll = (cb: Function) => {
    getProductsFromFile(cb);
  };

  public static findProductById = (id: string, cb: Function) => {
    getProductsFromFile((products: Product[]) => {
      const product = products.find((p) => {
        return p.id === id;
      });
      cb(product);
    });
  };
}

export default Product;
