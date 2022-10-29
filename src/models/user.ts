import { Schema, model } from "mongoose";

interface CartItem {
  productId: Schema.Types.ObjectId;
  quantity: number;
}

export interface IUser {
  name: string;
  email: string;
  cart: CartItem[];
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
      productId: { type: Schema.Types.ObjectId, required: true },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default model<IUser>("User", UserSchema);
