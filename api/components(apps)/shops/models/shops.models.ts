import { Schema } from "mongoose";
import { IShop } from "./shops.models.interface";
import { uniqueString } from "../../../utils";
import { AccountStatus } from "../../../constants";
import { model } from "mongoose";

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


export const Store = model<IShop>('Vendor', shopSchema);