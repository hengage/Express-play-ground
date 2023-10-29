import { Schema, model } from "mongoose";
import { IProduct } from "../products.interface";

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  shop: { type: String, ref: "Shop", required: true },
  vendor: { type: String, ref: "Vendor", required: true },
  sizes: [{ type: String }],
  colors: [{ type: String }],
});

export const Product = model<IProduct>("Product", productSchema);
