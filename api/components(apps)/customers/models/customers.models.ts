import { Schema, model } from "mongoose";
import { ICustomer } from "../customers.interface";
import { AccountStatus, Gender, URL_LINKS } from "../../../constants";
import { encryption, uniqueString } from "../../../utils";

const customerSchema = new Schema<ICustomer>(
  {
    _id: {
      type: String,
      required: true,
      default: () => uniqueString.generateUniqueString(4),
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePhoto: { type: String, default: URL_LINKS.DEFAULT_ACCOUNT_PHOTO },
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postalCode: { type: String, default: '' },
    country: { type: String, default: '' },
    latitude: Number,
    longitude: Number,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.ACTIVE,
    },
    lastLoggedIn: Date,
  },
  { timestamps: true, _id: false }
);

customerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await encryption.encryptValue(this.password);
    } catch (error: any) {
      return next(error);
    }
  }
  next();
});

export const Customer = model<ICustomer>("Customer", customerSchema);
