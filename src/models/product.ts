const products: Product[] = [];

class Product {
  private title: string;

  constructor(title: string) {
    this.title = title;
  }

  public save = () => {
    products.push(this);
  };

  public static fetchAll = () => {
    return products;
  };
}

export default Product;
