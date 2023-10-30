import { Schema, model } from "mongoose";
import { IVendor } from "../vendors.interface";
import { encryption, uniqueString } from "../../../utils";
import { AccountStatus } from "../../../constants";

const vendorSchema = new Schema<IVendor>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    name: {
      firstName: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
    },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: String,
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    govtIdPhoto: { type: String, required: true },
    businessname: String,
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Active,
    },
    lastLoggedIn: String,
  },
  { timestamps: true, _id: false }
);


vendorSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      try {
        this.password = await encryption.encryptValue(this.password);
        
      } catch (error: any) {
        return next(error);
      }
    }
    next();
  });

export const Vendor = model<IVendor>('Vendor', vendorSchema);