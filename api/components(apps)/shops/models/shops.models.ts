import { Schema } from "mongoose";
import { uniqueString } from "../../../utils";
import { AccountStatus, ShopCategory } from "../../../constants";
import { model } from "mongoose";
import { IShop, ICategory } from "../interfaces/shops.interface";

export const shopSchema = new Schema<IShop>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true, unique: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    vendor: {
      type: String,
      required: true,
      ref: "Vendor",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    geoLocation: {
      latitude: Number,
      longitude: Number,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    logo: { type: String, required: true },
    approved: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
  },
  { timestamps: true, _id: false }
);

export const categorySchema = new Schema<ICategory>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

export const Shop = model<IShop>("Shop", shopSchema);
export const Category = model<ICategory>("Category", categorySchema);
