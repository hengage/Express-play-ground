import { Schema } from "mongoose";
import { uniqueString } from "../../../utils";
import { AccountStatus, ShopCategory } from "../../../constants";
import { model } from "mongoose";
import { IShop, ICategory } from "../interfaces/shops.interface";

const shopSchema = new Schema<IShop>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    vendor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Vendor",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    geoLocation: {
      latitude: Number,
      longitude: Number,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        enum: ShopCategory,
      },
    ],
    logo: { type: String, default: "" },
    approved: { type: Boolean, default: false },
    status: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Active,
    },
  },
  { timestamps: true, _id: false }
);

const categorySchema = new Schema<ICategory>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: {
      type: String,
      required: true,
    },
    description: String,
    image: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);

export const Shop = model<IShop>("Shop", shopSchema);
export const Category = model<ICategory>("Category", categorySchema);
