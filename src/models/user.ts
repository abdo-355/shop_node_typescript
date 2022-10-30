import { Schema, model, HydratedDocument } from "mongoose";

import { IProduct } from "./product";

interface CartItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

export interface IUser {
  name: string;
  email: string;
  cart: CartItem[];
  addToCart: (product: HydratedDocument<IProduct>) => any;
  removeFromCart: (productId: string) => any;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

UserSchema.method("addToCart", function (product: HydratedDocument<IProduct>) {
  const cartProductIndex = this.cart.findIndex(
    (p: CartItem) => p.productId.toString() === product._id.toString()
  );

  let updatedCart = [...this.cart];
  let newQuantity = 1;

  if (cartProductIndex >= 0) {
    newQuantity += this.cart[cartProductIndex].quantity;
    updatedCart[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCart.push({ productId: product._id, quantity: 1 });
  }

  this.cart = updatedCart;

  return this.save();
});

UserSchema.methods.removeFromCart = function (productId: string) {
  const updatedCart = this.cart.filter(
    (item: CartItem) => item.productId.toString() !== productId.toString()
  );

  this.cart = updatedCart;
  return this.save();
};

export default model<IUser>("User", UserSchema);
