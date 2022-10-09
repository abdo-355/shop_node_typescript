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
  private title: string;
  private imgUrl: string;
  private description: string;
  private price: number;

  constructor(
    title: string,
    imgUrl: string,
    description: string,
    price: number
  ) {
    this.title = title;
    this.imgUrl = imgUrl;
    this.description = description;
    this.price = price;
  }

  public save = () => {
    getProductsFromFile((products: Product[]) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) throw err;
      });
    });
  };

  public static fetchAll = (cb: Function) => {
    getProductsFromFile(cb);
  };
}

export default Product;
