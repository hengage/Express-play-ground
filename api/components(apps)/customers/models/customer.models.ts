import { Schema, model } from "mongoose";
import { ICustomer } from "./customer.models.interface";
import { AccountStatus, Gender } from "../../../constants";
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
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: String,
    },
    geolocation: {
      latitude: Number,
      longitude: Number,
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      required: true,
      enum: Object.values(Gender),
    },
    profilePhoto: String,
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.Active,
    },
    lastLoginDate: Date,
  },
  { timestamps: true, _id: false }
);


customerSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
      try {
        this.password = await encryption.encryptValue(this.password);
        
      } catch (error: any) {
        return next(error);
      }
    }
    next();
  });

export const Customer = model<ICustomer>("Customerr", customerSchema);
