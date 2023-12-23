import { Schema, model } from "mongoose";
import { IProduct } from "../products.interface";
import { stringsUtils } from "../../../utils";

const productSchema = new Schema<IProduct>(
  {
    _id: {
      type: String,
      required: true,
      default: () => stringsUtils.generateUniqueString(4),
    },
    name: { type: String, required: true, set: stringsUtils.toLowerCaseSetter },
    description: { type: String, required: true, set: stringsUtils.toLowerCaseSetter },
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
