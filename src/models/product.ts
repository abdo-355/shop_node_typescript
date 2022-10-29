import { Schema, model } from "mongoose";

interface IProduct {
  title: string;
  price: number;
  imgUrl: string;
  description: string;
  userId: Schema.Types.ObjectId;
}

const productSchema = new Schema<IProduct>({
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
});

export default model<IProduct>("Product", productSchema);
