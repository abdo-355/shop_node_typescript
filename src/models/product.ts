import Cart from "./cart";

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

  save = () => {};

  static fetchAll = (cb: Function) => {};

  static findProductById = (id: string, cb: Function) => {};

  static deleteProduct = (id: string) => {};
}

export default Product;
