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
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    photo: String,
    street: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: String,
    govtIdPhoto: { type: String, required: true },
    approved: {type: Boolean, default: true},
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    lastLoggedIn: String,
  },
  { timestamps: true, _id: false }
);

vendorSchema.pre("save", async function (next) {
  this.firstName = this.firstName.toLowerCase();
  this.middleName = this.middleName.toLowerCase();
  this.lastName = this.lastName.toLowerCase();
  this.email = this.email.toLowerCase();
  this.country = this.country.toLowerCase();
  
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const Vendor = model<IVendor>("Vendor", vendorSchema);
