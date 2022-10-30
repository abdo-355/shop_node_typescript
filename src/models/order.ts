import { Schema, model } from "mongoose";

import { IProduct } from "./product";

interface OrderItem extends IProduct {
  quantity: number;
}

export interface IOrder {
  items: OrderItem[];
  user: {
    id: Schema.Types.ObjectId;
    name: string;
  };
}

const orderSchema = new Schema<IOrder>({
  items: [
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      imgUrl: {
        type: String,
        required: true,
      },
      userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
  },
});

export default model<IOrder>("Order", orderSchema);
