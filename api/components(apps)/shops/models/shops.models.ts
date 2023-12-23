import paginate from "mongoose-paginate-v2";

import mongoose, { Schema, model } from "mongoose";
import { uniqueString } from "../../../utils";
import { AccountStatus } from "../../../constants";
import { IShop, ICategory, IShopType } from "../interfaces/shops.interface";

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
    street: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number, Number],
        required: true,
      },
    },
    postalCode: { type: String },
    type: { type: String, ref: "ShopType", required: true },
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

shopSchema.index({ location: "2dsphere" });
shopSchema.plugin(paginate);

const shopTypeSchema = new Schema<IShopType>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String, required: true },
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
    shopType: { type: String, required: true },
  },
  { timestamps: true, _id: false }
);


shopSchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
  this.email = this.email.toLowerCase();
  this.country = this.country.toLowerCase();

  next();
});

shopTypeSchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
  next();
});

categorySchema.pre('save', async function (next) {
  this.name = this.name.toLowerCase();
  next();
});


export const Shop = model<IShop, mongoose.PaginateModel<IShop>>(
  "Shop",
  shopSchema
);
export const ShopType = model<IShopType>("ShopType", shopTypeSchema);
export const Category = model<ICategory>("Category", categorySchema);
