import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from "sequelize";

import Product from "./product";
import Cart from "./cart";

class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;

  declare quantity: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare CartId: ForeignKey<Cart["id"]>;
  declare ProductId: ForeignKey<Product["id"]>;
}

export default CartItem;
