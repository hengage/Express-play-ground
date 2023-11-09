import { Schema, model } from "mongoose";
import { IProduct } from "../products.interface";
import { uniqueString } from "../../../utils";

const productSchema = new Schema<IProduct>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photos: [{ type: String, required: true }],
    shop: { type: String, ref: "Shop", required: true },
    category: { type: String, required: true},
    vendor: { type: String, ref: "Vendor", required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
  },
  { timestamps: true, _id: false }
);

export const Product = model<IProduct>("Product", productSchema);
