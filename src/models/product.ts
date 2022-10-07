import { json } from "body-parser";
import fs from "fs";
import path from "path";

import rootPath from "../util/path";

const p = path.join(rootPath, "data", "products.json");

class Product {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  public save = () => {
    fs.readFile(p, (err, fileContent) => {
      let products: Product[] = [];
      if (!err) {
        products = JSON.parse(fileContent.toString());
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) throw err;
      });
    });
  };

  public static fetchAll = (cb: Function) => {
    fs.readFile(p, (err, data) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(data.toString()));
    });
  };
}

export default Product;
